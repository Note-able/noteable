'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runWebpackDevServer = runWebpackDevServer;
var WebpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');
var config = require('../../webpack.dev.config');

function runWebpackDevServer() {
  var bundleStart = null;
  var compiler = webpack(config);

  compiler.plugin('compile', function () {
    console.log('Bundling...');
    bundleStart = Date.now();
  });

  compiler.plugin('done', function () {
    console.log('Bundled in ' + (Date.now() - bundleStart) + 'ms');
  });

  var server = new WebpackDevServer(compiler, {
    info: false,
    inline: true,
    host: 'localhost',
    colors: true,
    contentBase: 'dist',
    publicPath: '/dist/',
    hot: false,
    stats: { colors: true },
    headers: { 'Access-Control-Allow-Origin': '*' },
    watchOptions: {
      poll: 1000
    }
  });

  server.listen(8081, 'localhost', function () {
    console.log('webpack dev server running on 8081');
  });
}