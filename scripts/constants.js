const pify = require('pify')
const { resolve } = require('path')
const { readdir } = require('fs')
const { dir: isDir } = require('path-type')
const pFilter = require('p-filter')
const readPkg = require('read-pkg')

const componentsDir = resolve(__dirname, '..', 'lib')
const componentNamesP = pify(readdir)(resolve(componentsDir))
  .then(paths => (
    pFilter(paths, path => isDir(resolve(componentsDir, path)))
  ))
const componentDirsP = componentNamesP
  .then((names) => (
    names
      .map(name => resolve(componentsDir, name))
  ))
const componentPkgsP = componentDirsP
  .then((componentDirs) => (
    Promise.all(componentDirs.map(readPkg))
  ))

module.exports = {
  componentsDir: resolve(__dirname, '..', 'lib'),
  componentNamesP,
  componentDirsP,
  componentPkgsP
}
