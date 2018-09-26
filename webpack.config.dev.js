const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const publicPath = '/';
module.exports = {
  mode: 'development',
  entry: {
    index: ['./example/index.js'],
  },
  output: {
    filename: '[name]-[hash].js',
    // the output bundle

    path: resolve(__dirname, 'dist'),

    publicPath: publicPath,
    libraryTarget: 'umd'
    // necessary for HMR to know where to load the hot update chunks
  },

  devtool: 'inline-source-map',

  devServer: {
    hot: true,
    // enable HMR on the server
    host: '127.0.0.1',
    contentBase: resolve(__dirname, 'dist'),
    // match the output path
    //historyApiFallback: {
    //  rewrites: [
    //    { from: /.*\/component\/.*/, to: '/index.html'}
    //  ]
    //},
    publicPath: publicPath,
    // match the output `publicPath`
    port: 9898,
    stats: "minimal"
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use:[ 'style-loader', 'css-loader', 'postcss-loader', 'less-loader', ]
      },
      {
        test: /\.hbs$/i,
        use: 'handlebars-loader'
      }
    ],
  },
  //需要将React挂在到window，方可这样用
  //externals: {
  //  'react': 'React',
  //  'react-dom': 'ReactDOM'
  //},
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally
    new webpack.NodeEnvironmentPlugin({
      NODE_ENV: 'development',
      DEBUG: false
    }),
    new HtmlWebpackPlugin({
      title: 'flop',
      template: './index.hbs',
      filename: './index.html',
      chunks: ['index']
    }),
    new webpack.NamedModulesPlugin()
  ],
};
