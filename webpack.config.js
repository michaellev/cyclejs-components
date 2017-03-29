const { resolve } = require('path')
const pkg = require('./package.json')

const contentBase = resolve(__dirname, 'public')
const repoName = pkg.repository.url
  .split('/')
  .slice(-1)[0]
  .slice(0, -4)

const config = {
  entry: './docs/index.ts',
  output: {
    filename: 'bundle.js',
    path: resolve(contentBase, repoName)
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  devtool: 'source-map',
  devServer: {
    publicPath: `/${repoName}`,
    contentBase
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
