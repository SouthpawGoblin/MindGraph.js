const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';
console.log(process.env.NODE_ENV);

const config = {
  mode: 'production',
  entry: path.resolve(__dirname, 'src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.min.js'
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      { 
        test: /\.ts$/, 
        loader: 'ts-loader',
        options: {
          configFile: path.resolve(__dirname, 'tsconfig.dist.json')
        }
      }
    ]
  }
}

module.exports = config;