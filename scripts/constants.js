const pify = require('pify')
const { resolve } = require('path')
const { readdir } = require('fs')
const { dir: isDir } = require('path-type')
const pFilter = require('p-filter')

const componentsDir = resolve(__dirname, '..', 'lib')
const componentNamesP = pify(readdir)(resolve(componentsDir))
  .then(paths => (
    pFilter(paths, path => isDir(resolve(componentsDir, path)))
  ))

module.exports = {
  componentsDir: resolve(__dirname, '..', 'lib'),
  componentNamesP
}
