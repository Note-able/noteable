var WebpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');
var config = require('../../webpack.config');

var server = new WebpackDevServer(webpack(config), {
  // webpack-dev-server options
  publicPath: config.output.publicPath,
  hot: true,
  stats: { colors: true }
});

server.listen(8081, 'localhost', function () {});