
module.exports = {
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
};
