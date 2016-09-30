'use strict'; // eslint-disable-line strict

const fs = require('fs');
const path = require('path');
const Svgo = require('svgo');
const xml = require('node-xml');

const svgo = new Svgo({
  floatPrecision: 2,
});

const commandLineArguments = process.argv.slice(2);
if (commandLineArguments.length !== 2) {
  console.error('Usage: build-svgs input-directory output-directory');
  process.exit(1);
}

function statAsync(path) {
  return new Promise(function(accept, reject) {
    fs.stat(path, function(error, stat) {
      if (error || !stat) {
        reject(error || new Error('Failed stat'));
      } else {
        accept({ path, stat });
      }
    });
  });
}

function findSvgsAsync(directory) {
  return new Promise(function(accept, reject) {
    fs.readdir(directory, function(error, files) {
      if (error || !files) {
        reject(error || new Error('No files.'));
      } else {
        accept(files);
      }
    });
  }).then(function(files) {
    return files.map(function(file) {
      return path.join(directory, file);
    });
  }).then(function(files) {
    return Promise.all(files.map(statAsync));
  }).then(function(stats) {
    return stats
      .map(function(item) {
        if (item.stat.isDirectory()) {
          return { directory: item.path };
        }

        if (item.stat.isFile()) {
          return { file: item.path };
        }

        return { other: item.path };
      })
    .filter(function(item) {
      return item.directory || (item.file && path.extname(item.file) === '.svg');
    });
  }).then(function(filesAndDirectories) {
    const directories = filesAndDirectories
      .map(function(item) { return item.directory; })
      .filter(function(item) { return item; });

    const files = filesAndDirectories
      .map(function(item) { return item.file; })
      .filter(function(item) { return item; });

    return Promise.all(files.concat(directories.map(findSvgsAsync)));
  }).then(function(results) {
    return results
      .reduce(function(left, right) {
        return left.concat(Array.isArray(right) ? right : [ right ]);
      }, []);
  });
}

function convertToCamelCase(name) {
  return name.split('-')
    .map(function(part, index) {
      return index ? part[0].toUpperCase() + part.slice(1) : part;
    }).join('');
}

function convertToPascalCase(name) {
  return name.split('-')
    .map(function(part) {
      return part[0].toUpperCase() + part.slice(1);
    }).join('');
}

const supportedAttributes = {
  version: null,
  class: 'className'
};

[
  'clip-rule',
  'cx',
  'cy',
  'd',
  'fill',
  'fill-opacity',
  'fill-rule',
  'height',
  'id',
  'opacity',
  'r',
  'rx',
  'ry',
  'stroke',
  'stroke-miterlimit',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'transform',
  'viewBox',
  'width',
  'x',
  'y',
].forEach(function(attribute) { supportedAttributes[attribute] = convertToCamelCase(attribute); });

const supportedElements = {
  title: null,
};

[
  'circle',
  'defs',
  'ellipse',
  'g',
  'path',
  'rect',
  'svg',
].forEach(function(element) { supportedElements[element] = convertToCamelCase(element); });

function getFileContentAsync(filePath) {
  return new Promise(function(accept, reject) {
    fs.readFile(filePath, 'utf8', function(error, data) {
      if (error || !data) {
        reject(error || new Error('No file content for ' + filePath));
      } else {
        accept({ path: filePath, content: data });
      }
    });
  });
}

function optimizeSvgAsync(file) {
  return new Promise(function(accept, reject) {
    svgo.optimize(file.content, function(result) {
      if (result.error) {
        reject(result);
      } else {
        accept({ path: file.path, content: result.data });
      }
    });
  });
}

function convertSvgToJsxAsync(file) {
  const filePath = file.path;
  return new Promise(function(accept, reject) {
    let methodBody = null;
    let rejected = false;

    const state = [];

    const parser = new xml.SaxParser(function(events) {
      events.onEndDocument(function() {
        if (rejected) {
          return;
        }

        if (!methodBody) {
          reject(new Error('No root element in file ' + filePath));
        }

        accept([
          'export function ',
          convertToPascalCase(path.basename(filePath, '.svg')),
          '() {\n  return ',
          methodBody,
          ';\n}\n',
        ].join(''));
      });
      events.onStartElementNS(function(element, attributes) {
        if (rejected) {
          return;
        }

        const outputElementName = supportedElements[element];
        if (outputElementName === null) {
          state.push({ ignore: true });
          return;
        }

        if (!outputElementName) {
          rejected = true;
          reject(new Error('Unrecognized element ' + element + ' in file ' + filePath));
          return;
        }

        let params = null;
        if (attributes.length) {
          const paramsBuilder = [];

          attributes.forEach(function(pair) {
            const outputAttributeName = supportedAttributes[pair[0]];
            if (outputAttributeName === null) {
              return;
            }

            if (!outputAttributeName && !rejected) {
              rejected = true;
              reject(new Error('Unrecognized attribute ' + pair[0] + ' in element ' + element + ' of file ' + filePath));
              return;
            }

            paramsBuilder.push([ outputAttributeName, ': \'', pair[1], '\'' ].join(''));
          });

          if (!rejected) {
            paramsBuilder.push();
            params = '{ ' + paramsBuilder.join(', ') + ' }';
          }
        }

        state.push({ preamble: 'createElement(\'' + outputElementName + '\'', params, children: []});
      });
      events.onEndElementNS(function() {
        if (rejected) {
          return;
        }

        const output = state.pop();
        if (output.ignore) {
          return;
        }

        const code = [ output.preamble ];
        if (output.params) {
          code.push(', ', output.params);
        } else if (output.children.length) {
          code.push(', null');
        }

        if (output.children.length) {
          const indentation = new Array(state.length + 3).join('  ');
          code.push(',\n', indentation, output.children.join(',\n' + indentation));
        }

        code.push(')');

        if (state.length) {
          state[state.length - 1].children.push(code.join(''));
        } else if (methodBody === null) {
          methodBody = code.join('');
        } else {
          rejected = true;
          reject(new Error('Multiple root elements in file ' + filePath));
        }
      });
      events.onError(function(message) {
        if (!rejected) {
          rejected = true;
          reject(new Error('Error from ' + file + ': ' + message));
        }
      });
    });

    parser.parseString(file.content);
  });
}

function processSvgAsync(filePath) {
  return getFileContentAsync(filePath)
    .then(optimizeSvgAsync)
    .then(convertSvgToJsxAsync);
}

function writeFileAsync(filePath, content) {
  return new Promise(function(accept, reject) {
    fs.writeFile(filePath, content, { encoding: 'utf8' }, function(error) {
      if (error) {
        reject(error);
      } else {
        accept();
      }
    });
  });
}

const inputDirectory = path.resolve(path.normalize(commandLineArguments[0]));
const outputDirectory = path.resolve(path.normalize(commandLineArguments[1]));
try {
  if (!fs.statSync(outputDirectory).isDirectory()) {
    console.error(outputDirectory + ' is not a directory.');
    process.exit(1);
  }
} catch (x) {
  console.error(outputDirectory + ' is not a directory.');
  process.exit(1);
}

findSvgsAsync(inputDirectory).then(function(filePaths) {
  return Promise.all(filePaths.map(function(filePath) {
    return processSvgAsync(filePath)
      .then(function(method) {
        const group = path.dirname(path.relative(inputDirectory, filePath));
        return { group: group === '.' ? 'common' : group, definition: method };
      });
  }));
}).then(function(methods) {
  return methods.reduce(function(groups, method) {
    if (!groups[method.group]) {
      groups[method.group] = [];
    }

    groups[method.group].push(method.definition);

    return groups;
  }, {});
}).then(function(groups) {
  return Object.keys(groups).map(function(groupName) {
    return {
      path: path.join(outputDirectory, groupName + '-icons.g.js'),
      content: 'import React from \'react\';\n\nconst createElement = React.createElement;\n\n' + groups[groupName].join('\n'),
    };
  });
}).then(function(outputFiles) {
  return Promise.all(outputFiles.map(function(file) {
    return writeFileAsync(file.path, file.content);
  }));
}).catch(function(error) {
  console.error(error.stack || error);
  process.exit(1);
});