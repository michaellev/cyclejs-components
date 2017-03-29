const { SyntaxKind, createSourceFile, ScriptTarget, forEachChild } = require('typescript')
const pify = require('pify')
const readFileP = pify(require('fs').readFile)
const { resolve } = require('path')
const componentsDir = resolve(__dirname, '..', '..', 'lib')
const readPkg = require('read-pkg')
const readdirP = pify(require('fs').readdir)
const pFilter = require('p-filter')
const { dir: isDir } = require('path-type')
const upperCamelCase = require('uppercamelcase')
const MarkdownIt = require('markdown-it')
const constantSourceSinkDescriptions = require('./constant-source-sink-descriptions')

const markdownIt = MarkdownIt({
  linkify: true,
  typographer: true
})
  .use(require('markdown-it-highlightjs'))

const componentIdsP = readdirP(resolve(componentsDir))
  .then(paths => (
    pFilter(paths, path => isDir(resolve(componentsDir, path)))
  ))

const pkgP = readPkg()

const isSourcesOrSinks = ({ kind, modifiers, name }) => {
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

const getSourceSinkMetadata = (node, source) => {
  const metadata = {
    name: node.name.text,
    direction: node.parent.name.text.toLowerCase().slice(0, -1),
    optional: !!node.questionToken
  }

  metadata.type = source
    .slice(node.type.pos, node.type.end)
    .trim()

  const descriptionMarkdown = [
    constantSourceSinkDescriptions[metadata.direction][metadata.name],
    node.jsDoc ? node.jsDoc[0].comment : undefined
  ].join('\n\n')
  metadata.descriptionHtml = markdownIt.render(descriptionMarkdown)
  return metadata
}

const toObjByName = a => a.reduce((o, m) => {
  o[m.name] = m
  return o
}, {})

const getSourcesAndSinks = async (componentId) => {
  const source = await readFileP(resolve(componentsDir, componentId, 'index.ts'), 'utf-8')
  const ast = createSourceFile('', source, ScriptTarget.ES2017, true)

  const sourceAndSinkNodes = []
  forEachChild(ast, (node) => {
    if (isSourcesOrSinks(node)) {
      sourceAndSinkNodes.push(...node.members)
    }
  })

  const sourcesAndSinks = sourceAndSinkNodes
    .map(node => getSourceSinkMetadata(node, source))

  sourcesAndSinks
    .forEach((node) => {
      node.parentId = componentId
    })

  const sources = toObjByName(
    sourcesAndSinks
      .filter(sourceOrSink => sourceOrSink.direction === 'source')
  )
  const sinks = toObjByName(
    sourcesAndSinks
      .filter(sourceOrSink => sourceOrSink.direction === 'sink')
  )
  return { sources, sinks }
}

const getComponentMetadata = async (id) => {
  const directory = resolve(componentsDir, id)
  const pkgP = readPkg(directory, { normalize: false })
  const { sources, sinks } = await getSourcesAndSinks(id)
  return {
    id,
    varName: upperCamelCase(id),
    directory,
    pkg: await pkgP,
    sources,
    sinks
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
    pkg: await pkgP,
    components
  }
  return metadata
}

module.exports = getMetadata
