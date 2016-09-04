var webpack = require('webpack');
var cleanWebpack = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:8081',
    'webpack/hot/only-dev-server',
    './src/client/entry',
  ],
  output: {
    path: __dirname + '/public/js/',
    filename: 'app.js',
    publicPath: 'http://localhost:8081/js/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('style.css', {
      allChunks: true,
    }),
  ],
  resolve: {
    extensions: ['', '.js'],
    moduleDirectories: ['./node_modules']
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loaders: ['react-hot', 'babel-loader?presets[]=react,presets[]=stage-1,presets[]=es2015,plugins[]=transform-class-properties,plugins[]=transform-es2015-modules-commonjs'],
        exclude: /(node_modules)/,
      },
    ]
  },
}
