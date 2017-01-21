var syntax = require('postcss-less');

module.exports = {
  plugins: [
    require('postcss-smart-import')({ }),
    require('precss')({ /* ...options */ }),
    require('autoprefixer')({ /* ...options */ })
  ],
  options: {
    syntax: syntax
  }
}