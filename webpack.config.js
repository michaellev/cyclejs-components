const { resolve } = require('path')

const config = {
  entry: './docs/src/index.ts',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'docs', 'lib')
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
  }
}

module.exports = config
