'use strict';

require('babel-core/register')({
	only: __dirname + '/src',
});

const forever = require('forever-monitor');

const webpack = require('./src/server/webpack.js');
webpack.runWebpackDevServer();

let app = new forever.Monitor('./server.js', {
	watch: true,
	watchDirectory: './src',
	usePolling: true,
}).start();

app.on('watch:restart', function (info) {
	console.log(`\t${info.stat} changed`);
});

process.on('SIGTERM', function() {
	app.stop();
});