const { readdirSync } = require('fs')
const { resolve } = require('path')
const camelCase = require('camelcase')
const upperCamelCase = require('uppercamelcase')

const demosDirPath = resolve(__dirname, 'demos')

module.exports = function () {
  const paths = readdirSync(demosDirPath)

  const names = paths
    .map(path => (
      {
        path,
        component: upperCamelCase(path.slice(0, -3)),
        sourceHtml: camelCase(path.slice(0, -3)) + 'SourceHtml'
      }
    ))

  const imports = names
    .map(({ path, component, sourceHtml }) => {
      const modulePath = resolve(demosDirPath, path)
      return [
        `import ${component} from '${modulePath.slice(0, -3)}'`,
        `import ${sourceHtml} from '!!./docs/typescript-source-highlight-loader!${modulePath}'`
      ].join('\n')
    })
    .join('\n')

  const eksport = 'export default [\n' + names
    .map(({ path, component, sourceHtml }) => (
      []
        .concat([['id', `'${path.slice(0, -3)}'`]])
        .concat([['Component', component]])
        .concat([['sourceHtml', sourceHtml]])
        .map(([ key, val ]) => `    ${key}: ${val}`)
        .join(',\n')
    ))
    .map(inner => `  {\n${inner}\n}`)
    .join() + '\n]'

  return imports + '\n\n' + eksport
}
