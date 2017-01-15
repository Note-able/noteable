const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const projectRoot = __dirname;

module.exports = {
  entry: {
    main: path.join(projectRoot, '/src/client/entry.js'),
  },

  output: {
    path: path.resolve(projectRoot, './public/js/dist'),
    filename: '[name].bundle.js',
  },

  devtool: '#source-map',

  plugins: [
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin({
      filename: 'style.css',
      allChunks: true,
    }),
  ],

  resolveLoader: {
    modules: [
      path.resolve(projectRoot, './node_modules'),
    ],
    extensions: ['*', '.js', '.jsx'],
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader!autoprefixer-loader' }),
      },
      {
        test: /.less$/,
        loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader!autoprefixer-loader!less-loader' }),
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
};
