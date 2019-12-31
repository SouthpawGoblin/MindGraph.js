const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';
console.log(process.env.NODE_ENV);

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  entry: path.resolve(__dirname, isDev ? 'test/index.ts' : 'src/index.ts'),
  output: {
    path: path.resolve(__dirname, isDev ? 'build' : 'dist'),
    filename: 'index.min.js'
  },
  devtool: 'eval-source-map',
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      { 
        test: /\.ts$/, 
        loader: 'ts-loader',
        options: {
          transpileOnly: false
        } 
      }
    ]
  },
  plugins: isDev ? [
    new HtmlWebpackPlugin({ template: './test/index.html' }),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ] : []
}