const pify = require('pify')
const readPkg = require('read-pkg')
const writeJsonFile = require('write-json-file')
const semver = require('semver')
const { componentsDir, componentsPkgFilename } = require('./constants')
const { resolve } = require('path')
const git = require('simple-git')()

const [,, componentName, magnitude, skipCleanCheck] = process.argv

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
    if (!skipCleanCheck && !isGitClean) {
      return Promise.reject(Error('repository is not clean'))
    }

    const version = semver.inc(pkg.version, magnitude)
    const newPkg = Object.assign({}, pkg, { version })
    const writtenP = writeJsonFile(pkgPath, newPkg, { indent: 2, sortKeys: true })

    return Promise
      .all([version, writtenP])
  })
  .then(([version]) => {
    const commitMsg = `${componentName}-v${version}`
    git
      .add(pkgPath)
      .commit(commitMsg)
      .addTag(commitMsg)
      .push()
      .pushTags()
  })
  .catch((err) => {
    process.exitCode = 1
    console.error('Error: ' + err.message)
  })
