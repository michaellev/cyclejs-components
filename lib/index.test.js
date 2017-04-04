import test from 'ava'
import dekko from 'dekko'
import { componentsDirectory } from '../utils/constants'
import { basename } from 'path'
import getMetadata from '../utils/get-metadata'

const metadataP = getMetadata()

let componentDirsDekko
test.before(() => {
  process.chdir(componentsDirectory)
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

test('each component has a package.json', async (t) => {
  const { components } = await metadataP
  Object.values(components)
    .forEach((component) => {
      t.truthy(component.pkg, 'missing package.json in ' + component.id)
    })
})

test('component `package.json` name', async (t) => {
  const { components } = await metadataP
  Object.values(components)
    .forEach(({ pkg, id }) => {
      t.is(pkg.name, '@cycles/' + id)
    })
})

test('components do not have devDependencies', async (t) => {
  const { components } = await metadataP
  Object.values(components)
    .forEach(({ id, pkg }) => {
      t.is(
        pkg.devDependencies,
        undefined,
        `component ${id} has devDependencies`
      )
    })
})
