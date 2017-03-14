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
        source: camelCase(path.slice(0, -3)) + 'Source'
      }
    ))

  const imports = names
    .map(({ path, component, source }) => {
      const modulePath = resolve(demosDirPath, path)
      return [
        `import ${component} from '${modulePath.slice(0, -3)}'`,
        `import ${source} from '!!raw-loader!${modulePath}'`
      ].join('\n')
    })
    .join('\n')

  const eksport = 'export default [\n' + names
    .map(({ path, component, source }) => (
      []
        .concat([['id', `'${path.slice(0, -3)}'`]])
        .concat([['Component', component]])
        .concat([['source', source]])
        .map(([ key, val ]) => `    ${key}: ${val}`)
        .join(',\n')
    ))
    .map(inner => `  {\n${inner}\n}`)
    .join() + '\n]'

  return imports + '\n\n' + eksport
}
