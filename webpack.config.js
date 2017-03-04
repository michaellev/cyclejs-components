const { resolve } = require('path')
const fail = require('webpack-fail-plugin')

const config = {
  entry: './docs/index.ts',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'docs')
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    ]
  },
  plugins: [
    fail
  ]
}

module.exports = config
