const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

console.log(process.env.NODE_ENV);

const config = {
  mode: 'production',
  entry: path.resolve(__dirname, 'test/index.ts'),
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'doc.bundle.js'
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
          transpileOnly: true,
          configFile: path.resolve(__dirname, 'tsconfig.docs.json')
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './test/index.html' }),
    new ForkTsCheckerWebpackPlugin({ tsconfig: path.resolve(__dirname, 'tsconfig.docs.json') }),
    new CleanWebpackPlugin()
  ]
}

module.exports = config;