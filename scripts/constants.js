const pify = require('pify')
const { resolve } = require('path')
const { readdir } = require('fs')

const componentsDir = resolve(__dirname, '..', 'lib')
const componentNamesP = pify(readdir)(resolve(componentsDir))
const componentDirsP = componentNamesP
  .then((names) => (
    names
      .map(name => resolve(componentsDir, name))
  ))

module.exports = {
  componentsDir: resolve(__dirname, '..', 'lib'),
  componentDirsP
}
