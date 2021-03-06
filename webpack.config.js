var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: __dirname + "/client",
  entry: {
    app: './app/app.js',
  },
  output: {
    path: __dirname,
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        loaders: ['ng-annotate?add=true'],
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, "client"),
        ],

      },
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
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      }
    ]
  },
  /*plugins: [
    new webpack.optimize.UglifyJsPlugin({
      mangle: false
    })
  ],*/
  node: {
    fs: "empty"
  },
  watch: true,
};
