const { resolve } = require('path')

const config = {
  entry: './docs/index.ts',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'docs-build')
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
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.md$/,
        use: [
          'ent/decode',
          'raw-loader',
          'markdown-loader'
        ]
      }
    ]
  }
}

module.exports = config
