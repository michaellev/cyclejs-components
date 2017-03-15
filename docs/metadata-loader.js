const ts = require('typescript')
const { readdirSync, readFileSync } = require('fs')
const { resolve, parse: parsePath } = require('path')
const upperCamelCase = require('uppercamelcase')
const { componentsDir } = require('../scripts/constants')

const getProps = (component) => {
  const source = readFileSync(
    resolve(componentsDir, component.path, 'index.ts'),
    { encoding: 'utf-8' }
  )
  delete component.path
  const sourceFile = ts.createSourceFile(
    '',
    source,
    ts.ScriptTarget.ES2017,
    true
  )

  ts.forEachChild(sourceFile, node => {
    if (ts.SyntaxKind[node.kind] !== 'InterfaceDeclaration') {
      return
    }
    if (node.modifiers === undefined) {
      return
    }
    if (node.modifiers.filter((modifier) => ts.SyntaxKind[modifier.kind] === 'ExportKeyword').length === 0) {
      return
    }
    if (['Sources', 'Sinks'].includes(node.name.text) === false) {
      return
    }
    const propNodes = node.members
    propNodes.forEach((propNode) => {
      const prop = {
        name: propNode.name.text,
        direction: propNode.parent.name.text.toLowerCase().slice(0, -1),
        type: source.slice(propNode.type.pos, propNode.type.end).trim(),
        mandatory: !propNode.questionToken
      }
      prop.id = [prop.direction, prop.name].join('.')
      prop.parentId = component.id
      if (['DOM', 'DOMSource'].includes(propNode.name.text) === false) {
        if (propNode.jsDoc === undefined) {
          throw new Error(`${prop.direction} property \`${prop.id}\` of \`${component.id}\` is undocumented`)
        }
        prop.description = propNode.jsDoc.map(jsDoc => jsDoc.comment).join('\n')
      }
      component.properties[prop.id] = prop
    })
  })
  return component
}

module.exports = function () {
  const components = readdirSync(componentsDir)
    .map((path) => {
      const id = parsePath(path).name
      return {
        id,
        path,
        varName: upperCamelCase(id),
        properties: {}
      }
    })
    .map(getProps)
    .reduce((components, component) => {
      components[component.id] = component
      return components
    }, {})

  return 'export default ' + JSON.stringify(components)
}
