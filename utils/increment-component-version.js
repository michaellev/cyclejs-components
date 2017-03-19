const pify = require('pify')
const readPkg = require('read-pkg')
const writePkg = require('write-pkg')
const semver = require('semver')
const { componentsDirectory } = require('./constants')
const { resolve } = require('path')
const git = require('simple-git')()

const [,, componentId, magnitude, skipCleanCheck] = process.argv

if (componentId === undefined || magnitude === undefined) {
  throw new Error('must provide component id and magnitude. For example, `$ <command> clickable minor`')
}

const magnitudes = ['major', 'minor', 'patch']

if (magnitudes.includes(magnitude) === false) {
  throw new Error(`\`magnitude\` must be one of ${magnitudes}. It was ${magnitude}`)
}

const isGitCleanP = pify(git.status.bind(git))()
  .then(status => status.files.length === 0)

const componentDirectory = resolve(componentsDirectory, componentId)

const pkgP = readPkg(componentDirectory, { normalize: false })

Promise
  .all([isGitCleanP, pkgP])
  .then(([isGitClean, pkg]) => {
    if (!skipCleanCheck && !isGitClean) {
      return Promise.reject(Error('repository is not clean'))
    }

    const version = semver.inc(pkg.version, magnitude)
    const newPkg = Object.assign({}, pkg, { version })
    const writtenP = writePkg(componentDirectory, newPkg)

    return Promise
      .all([version, writtenP])
  })
  .then(([version]) => {
    const commitMsg = `${componentId}-v${version}`
    git
      .add(resolve(componentDirectory, 'package.json'))
      .commit(commitMsg)
      .addTag(commitMsg)
      .push()
      .pushTags()
  })
  .catch((err) => {
    process.exitCode = 1
    console.error('Error: ' + err.message)
  })
