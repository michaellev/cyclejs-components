import test from 'ava'
import dekko from 'dekko'
import { componentsDir, componentDirsP } from '../scripts/constants'
import { basename, resolve } from 'path'
import pMap from 'p-map'
import { file as isFile } from 'path-type'

let componentDirsDekko
test.before(() => {
  process.chdir(componentsDir)
  componentDirsDekko = dekko('*')
    .filter(name => name !== thisBasename)
})

const thisBasename = basename(__filename)

test('directory has exactly this file and some directories', (t) => {
  dekko(thisBasename)
    .isFile()
  componentDirsDekko
    .isDirectory()
})

test('component directories names', (t) => {
  const regExpStr = '^[a-z]*([a-z]|[a-z]-)*[a-z]$'
  const validComponentDirname = new RegExp(regExpStr)
  componentDirsDekko
    .assert('does not conform to ' + regExpStr, (dir) => {
      return validComponentDirname.test(dir)
    })
})

test('each component has a package.json', (t) => {
  return componentDirsP
    .then((componentDirs) => (
      componentDirs.map(componentDir => (
        Promise.all([
          componentDir,
          isFile(resolve(componentDir, 'package.json')).catch(() => false)
        ])
      ))
    ))
    .then((areFiles) => (
      pMap(areFiles, ([componentDir, hasPkgJson]) => (
        t.true(hasPkgJson, 'missing package.json in ' + componentDir)
      ))
    ))
})
