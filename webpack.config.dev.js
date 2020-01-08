const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

console.log(process.env.NODE_ENV);

const config = {
  mode: 'development',
  entry: path.resolve(__dirname, 'test/index.ts'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'test.bundle.js'
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
          configFile: path.resolve(__dirname, 'tsconfig.dev.json')
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './test/index.html' }),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
  ]
}

module.exports = config;