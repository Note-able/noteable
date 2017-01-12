'use strict';

require.extensions['.less'] = function () {};

var fs = require('fs');

var env = process.env.NODE_ENV;
global.DEBUG = env !== 'production' && env !== 'internal';
global.PRODUCTION = env === 'production';
global.CLIENT = false;

fs.stat('./public/js/dist/main.bundle.js', function (err, stat) {
	if (err == null) {} else if (err.code == 'ENOENT') {
		console.log('no main bundle!');
	}
});

fs.stat('/proc/1/cgroup', function (err, stat) {
	if (err == null) {
		var stream = fs.createReadStream('/proc/1/cgroup', { encoding: 'utf8' });

		var acc = '';
		var pos = 0;
		var index;

		stream.on('data', function (chunk) {
			index = chunk.indexOf('\n');
			acc += chunk;
			index !== -1 ? stream.close() : pos += chunk.length;
		}).on('close', function () {
			if (acc.indexOf('docker') === -1) {
				require('babel-core/register')({
					only: __dirname + '/src/server'
				});
			}

			require('./src/server/server.js');
		}).on('error', function (err) {
			console.log(err);
		});
	} else if (err.code == 'ENOENT') {
		require('babel-core/register')({
			only: __dirname + '/src/server'
		});

		require('./src/server/server.js');
	}
});
