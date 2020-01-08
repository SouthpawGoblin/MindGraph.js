const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

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
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
}

module.exports = config;