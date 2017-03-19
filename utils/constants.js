const pify = require('pify')
const { resolve } = require('path')
const { readdir } = require('fs')
const { dir: isDir } = require('path-type')
const pFilter = require('p-filter')

const componentsDirectory = resolve(__dirname, '..', 'lib')
const componentIdsP = pify(readdir)(resolve(componentsDirectory))
  .then(paths => (
    pFilter(paths, path => isDir(resolve(componentsDirectory, path)))
  ))

module.exports = {
  componentsDirectory,
  componentIdsP
}
