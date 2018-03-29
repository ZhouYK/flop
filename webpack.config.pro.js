const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const publicPath = './';
module.exports = {
  mode: 'production',
  entry: {
    flop: ['babel-polyfill', './example/index.js']
  },
  output: {
    filename: '[name]-[hash].js',
    // the output bundle
    path: resolve(__dirname, 'example/dist'),
    publicPath: publicPath,
    libraryTarget: 'umd',
    // necessary for HMR to know where to load the hot update chunks
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [ {
          loader: 'babel-loader'
        }, ],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use:[ 'style-loader', 'css-loader', 'postcss-loader', 'less-loader', ]
      }
    ],
  },
  optimization: {
    minimize: true
  },
  plugins: [
    new webpack.DefinePlugin( {
      'process.env': {
        'NODE_ENV': '"production"'
      }
    } ),
    new HtmlWebpackPlugin({
      title: 'flop',
      template: './index.hbs',
      filename: './index.html',
      chunks: ['flop']
    }),
    new webpack.NamedModulesPlugin()
  ],
};