var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: __dirname + "/client",
  entry: {
    app: './app/app.js',
  },
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, "client"),
        ],

        test: /\.jsx?$/,

        query: {
          presets: ['es2015']
        }
      },
    ]
  },
  node: {
    fs: "empty"
  },
  
};
