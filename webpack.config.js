const { resolve } = require('path')

const publicPath = resolve(__dirname, 'public')

const config = {
  entry: './docs/index.ts',
  output: {
    filename: 'bundle.js',
    path: publicPath
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  devtool: 'source-map',
  devServer: {
    publicPath: '/',
    contentBase: publicPath
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      },
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader'
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
