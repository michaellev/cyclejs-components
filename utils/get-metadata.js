const { SyntaxKind, createSourceFile, ScriptTarget, forEachChild } = require('typescript')
const pify = require('pify')
const readFileP = pify(require('fs').readFile)
const { resolve } = require('path')
const componentsDir = resolve(__dirname, '..', 'lib')
const readPkg = require('read-pkg')
const readdirP = pify(require('fs').readdir)
const pFilter = require('p-filter')
const { dir: isDir } = require('path-type')

const componentIdsP = readdirP(resolve(componentsDir))
  .then(paths => (
    pFilter(paths, path => isDir(resolve(componentsDir, path)))
  ))

const isSourceOrSink = ({ kind, modifiers, name }) => {
  if (SyntaxKind[kind] !== 'InterfaceDeclaration') {
    return false
  }
  if (modifiers === undefined) {
    return false
  }
  if (modifiers.filter(modifier => SyntaxKind[modifier.kind] === 'ExportKeyword').length === 0) {
    return false
  }
  if (['Sources', 'Sinks'].includes(name.text) === false) {
    return false
  }
  return true
}

const getProperties = async (componentId) => {
  const source = await readFileP(resolve(componentsDir, componentId, 'index.ts'), 'utf-8')
  const ast = createSourceFile('', source, ScriptTarget.ES2017, true)

  const propertyNodes = []
  forEachChild(ast, (node) => {
    if (isSourceOrSink(node)) {
      propertyNodes.push(...node.members)
    }
  })

  const properties = propertyNodes
    .reduce((properties, propertyNode) => {
      const property = {
        name: propertyNode.name.text,
        direction: propertyNode.parent.name.text.toLowerCase().slice(0, -1),
        type: source.slice(propertyNode.type.pos, propertyNode.type.end).trim(),
        optional: !!propertyNode.questionToken
      }
      property.id = [property.direction, property.name].join('.')
      property.parentId = componentId
      property.description = propertyNode.jsDoc ? propertyNode.jsDoc
        .map(jsDoc => jsDoc.comment).join('\n') : undefined

      properties[property.id] = property
      return properties
    }, {})

  return properties
}

const getComponentMetadata = async (id) => {
  const directory = resolve(componentsDir, id)
  const pkgP = readPkg(directory, { normalize: false })
  const propertiesP = getProperties(id)
  return {
    id,
    directory,
    pkg: await pkgP,
    properties: await propertiesP
  }
}

const getMetadata = async () => {
  const componentIds = await componentIdsP
  const componentMetadatas = componentIds
    .map(getComponentMetadata)
  const components = (await Promise.all(componentMetadatas))
    .reduce((components, componentMetadata) => {
      components[componentMetadata.id] = componentMetadata
      return components
    }, {})
  const metadata = {
    components
  }
  return metadata
}

module.exports = getMetadata
