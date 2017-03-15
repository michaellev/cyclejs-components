const readPkg = require('read-pkg')
const writeJsonFile = require('write-json-file')
const semver = require('semver')
const { componentsDir, componentsPkgFilename } = require('./constants')
const { resolve } = require('path')

const [,, componentName, magnitude] = process.argv

if (componentName === undefined || magnitude === undefined) {
  throw new Error('must provide both component name and magnitude. For example, `$ <command> clickable minor`')
}

const magnitudes = ['major', 'minor', 'patch']

if (magnitudes.includes(magnitude) === false) {
  throw new Error(`\`magnitude\` must be one of ${magnitudes}. It was ${magnitude}`)
}

const pkgPath = resolve(componentsDir, componentName, componentsPkgFilename)

readPkg(pkgPath, { normalize: false })
  .then((pkg) => (
    Object.assign({}, pkg, { version: semver.inc(pkg.version, magnitude) })
  ))
  .then((pkg) => (
    writeJsonFile(pkgPath, pkg, { indent: 2, sortKeys: true })
  ))
