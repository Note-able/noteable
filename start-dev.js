'use strict';

require('babel-core/register')({
	only: __dirname + '/src',
});

const forever = require('forever-monitor');

let app = new forever.Monitor('./server.js', {
	watch: true,
	watchDirectory: './src/server',
	usePolling: true,
}).start();

app.on('watch:restart', function (info) {
	console.log(`\t${info.stat} changed`);
});

process.on('SIGTERM', function() {
	app.stop();
});