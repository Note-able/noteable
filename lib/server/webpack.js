const WebpackDevServer = require(`webpack-dev-server`);
const webpack = require(`webpack`);
const config = require(`../../webpack.config`);

const server = new WebpackDevServer(webpack(config), {
  // webpack-dev-server options
  publicPath: config.output.publicPath,
  hot: true,
  stats: { colors: true },
  headers: { 'Access-Control-Allow-Origin': '*' }
});

server.listen(8081, `localhost`, null);