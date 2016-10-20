'use strict';

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

rl.on('line', function(text) {
	if (text === 'r') {
		var exec = require('child_process').exec;
		var cmd = './node_modules/.bin/webpack';
		console.log('bundling...')
		exec(cmd, function(error, stdout, stderr) {
		  console.log(stdout);
		});
	}
});
