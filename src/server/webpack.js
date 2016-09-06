const WebpackDevServer = require(`webpack-dev-server`);
const webpack = require(`webpack`);
const config = require(`../../webpack.dev.config`);

export function runWebpackDevServer() {
	let bundleStart = null;
	let compiler = webpack(config);

	compiler.plugin('compile', function() {
		console.log('Bundling...');
		bundleStart = Date.now();
	});

	compiler.plugin('done', function () {
		console.log('Bundled in ' + (Date.now() - bundleStart) + 'ms');
	});

	const server = new WebpackDevServer(compiler, {
	  // webpack-dev-server options
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

	server.listen(8081, `localhost`, function() {
		console.log('webpack dev server running on 8081');
	});
}
