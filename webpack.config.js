var webpack = require('webpack');
var cleanWebpack = require('clean-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  entry: './lib/client/entry',
  output: {
    path: __dirname + '/public/js',
    filename: 'app.js',
    publicPath: 'http://localhost:8081/js/',
  },
  resolve: {
    extensions: ['', '.js'],
    moduleDirectories: ['./node_modules']
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loaders: ['babel-loader?presets[]=react,presets[]=es2015,plugins[]=transform-es2015-block-scoping,plugins[]=transform-es2015-classes,plugins[]=transform-react-jsx'],
        exclude: /(node_modules)/,
      }
    ]
  }
}
