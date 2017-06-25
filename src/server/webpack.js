const WebpackDevServer = require(`webpack-dev-server`);
const webpack = require('webpack');
const config = require('../../webpack.dev.config');

export function runWebpackDevServer() {
  let bundleStart = null;
  const compiler = webpack(config);

  compiler.plugin('compile', () => {
    console.log('Bundling...');
    bundleStart = Date.now();
  });

  compiler.plugin('done', () => {
    console.log(`Bundled in ${Date.now() - bundleStart}ms`);
  });

  const server = new WebpackDevServer(compiler, {
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
      poll: 1000,
    },
  });

  server.listen(8081, 'localhost', () => {
    console.log('webpack dev server running on 8081');
  });
}
