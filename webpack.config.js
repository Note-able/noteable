const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
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

  devtool: '#source-map',

  plugins: [
    new ExtractTextPlugin({
      filename: 'style.css',
      allChunks: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    new webpack.optimize.UglifyJsPlugin(),
  ],

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules'],
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
          use: ['css-loader?camelCase&localIdentName=[name]--[local]--[hash:base64:5]', { loader: 'postcss-loader', options: { plugins: [autoprefixer] } }, 'less-loader'],
        }),
      },
    ],
  },
  devServer: {
    inline: true,
    hot: false,
    stats: { colors: true },
    contentBase: './lib/public',
    headers: { 'Access-Control-Allow-Origin': '*' },
    watchOptions: {
      poll: 1000,
    },
  },
};
