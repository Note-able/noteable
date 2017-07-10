const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const projectRoot = __dirname;

module.exports = {
  entry: {
    main: path.join(projectRoot, '/src/client/entry.jsx'),
  },

  output: {
    path: path.resolve(projectRoot, './public/js/dist'),
    filename: '[name].bundle.js',
  },

  devtool: 'source-map',

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin({
      filename: 'style.css',
      allChunks: true,
    }),
  ],

  resolve: {
    extensions: [ '.js', '.jsx' ],
    modules: [ 'node_modules' ],
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
      },
      {
        test: /\.(less|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [ 'css-loader', { loader: 'postcss-loader', options: { plugins: [ autoprefixer ] } }, 'less-loader' ],
        }),
      },
    ],
  },
};
