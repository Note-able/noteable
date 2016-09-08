const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const projectRoot = __dirname;

module.exports = {
  entry: {
    main: path.join(projectRoot, '/src/client/entry.js'),
  },

  output: {
    path: path.resolve(projectRoot, './dist'),
    filename: '[name].bundle.js',
  },

  devtool: '#source-map',

  plugins: [
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('style.css', {
      allChunks: true,
    }),
  ],

  resolve: {
    root: [
      path.resolve(projectRoot, './node_modules'),
    ],
    extensions: ['', '.js', '.jsx'],
    moduleDirectories: ['node_modules'],
  },

  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
      },
    ],
  },
};
