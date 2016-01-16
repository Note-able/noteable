var webpack = require('webpack');
var cleanWebpack = require('clean-webpack-plugin');

var ignore = new webpack.IgnorePlugin(new RegExp("/(node_modules|ckeditor)/"))

module.exports = {
  devtool: 'inline-source-map',
  entry: './lib/client/entry',
  output: {
    path: __dirname + '/public/js',
    filename: 'app.js',
    publicPath: 'http://localhost:8081/js/',
  },
  plugins: [
    ignore,
    new webpack.NoErrorsPlugin(),
   // new cleanWebpack(['lib'])
  ],
  resolve: {
    modulesDirectories: ['node_modules', 'shared'],
    extensions: ['', '.js']
  },
  watchOptions: {
    poll: true,
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loaders: ['react-hot', 'babel-loader?presets[]=react,presets[]=es2015,plugins[]=transform-es2015-classes,plugins[]=transform-react-jsx'],
        exclude: /(node_modules|ckeditor)/,
      }
    ]
  }
}
