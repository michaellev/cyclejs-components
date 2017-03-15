const pify = require('pify')
const { readdir } = require('fs')
const readdirP = pify(readdir)
const { resolve } = require('path')
const readPkg = require('read-pkg')
const writePkg = require('write-pkg')
const {
    componentsDir,
    componentsPkgFilename
} = require('../scripts/constants')

const projectRoot = resolve(__dirname, '..')
const repoPkgP = readPkg(projectRoot, { normalize: false })

const relevantRepoPkgKeys = [
  'repository',
  'author',
  'contributors',
  'license',
  'bugs',
  'homepage'
]

const mkComponentPkg = (name, repoPkg, componentPkg) => {
  const relevantRepoPkg = Object
    .entries(repoPkg)
    .reduce((pkg, [key, value]) => {
      if (relevantRepoPkgKeys.includes(key)) {
        pkg[key] = value
      }
      return pkg
    }, {})

  const specifics = {
    name: '@cycles/' + name,
    description: `Cycle.js web component \`${name}\``,
    keywords: repoPkg.keywords.concat(name)
  }

  const result = Object.assign({}, relevantRepoPkg, componentPkg, specifics)
  return result
}

const updateComponentPkg = (componentName) => {
  const componentPath = resolve(componentsDir, componentName)
  const componentPkgP = readPkg(resolve(componentPath, componentsPkgFilename), { normalize: false })
  const resultPkgP = Promise
    .all([ repoPkgP, componentPkgP ])
    .then(([ repoPkg, componentPkg ]) => (
      mkComponentPkg(componentName, repoPkg, componentPkg)
    ))
  resultPkgP
    .then(resultPkg => writePkg(componentPath, resultPkg))
}

const componentNamesP = readdirP(componentsDir)

componentNamesP
  .then((componentNames) => (
    componentNames
      .forEach(updateComponentPkg)
  ))
