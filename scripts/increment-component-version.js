const pify = require('pify')
const readPkg = require('read-pkg')
const writeJsonFile = require('write-json-file')
const semver = require('semver')
const { componentsDir, componentsPkgFilename } = require('./constants')
const { resolve } = require('path')
const git = require('simple-git')()

const [,, componentName, magnitude] = process.argv

if (componentName === undefined || magnitude === undefined) {
  throw new Error('must provide both component name and magnitude. For example, `$ <command> clickable minor`')
}

const magnitudes = ['major', 'minor', 'patch']

if (magnitudes.includes(magnitude) === false) {
  throw new Error(`\`magnitude\` must be one of ${magnitudes}. It was ${magnitude}`)
}

const pkgPath = resolve(componentsDir, componentName, componentsPkgFilename)

const isGitCleanP = pify(git.status.bind(git))()
  .then(status => status.files.length === 0)

const pkgP = readPkg(pkgPath, { normalize: false })

Promise
  .all([isGitCleanP, pkgP])
  .then(([ isGitClean, pkg ]) => {
    if (!isGitClean) {
      console.error('ERROR: repository is not clean')
      process.exitCode = 1
      return
    }
    const newPkg = Object.assign({}, pkg, { version: semver.inc(pkg.version, magnitude) })
    writeJsonFile(pkgPath, newPkg, { indent: 2, sortKeys: true })
  })
