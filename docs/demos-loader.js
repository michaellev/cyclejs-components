const { resolve } = require('path')
const getMetadata = require('../utils/get-metadata')

module.exports = async function () {
  const callback = this.async()
  const { components } = await getMetadata()
  const demos = Object.values(components)
    .map(({ id, directory, varName }) => {
      const path = resolve(directory, 'demo.ts')
      return {
        id,
        path,
        varName,
        sourceHtmlVarName: 'sourceHtml' + varName
      }
    })

  const imports = demos
    .map(({ path, varName, sourceHtmlVarName }) => {
      return [
        `import ${varName} from '${path}'`,
        `import ${sourceHtmlVarName} from '!!./docs/typescript-source-highlight-loader!${path}'`
      ].join('\n')
    })
    .join('\n')

  const eksport = 'export default [\n' + demos
    .map(({ id, varName, sourceHtmlVarName }) => (
      []
        .concat([['id', `'${id}'`]])
        .concat([['Component', varName]])
        .concat([['sourceHtml', sourceHtmlVarName]])
        .map(([ key, val ]) => `    ${key}: ${val}`)
        .join(',\n')
    ))
    .map(inner => `  {\n${inner}\n  }`)
    .join() + '\n]'

  callback(null, imports + '\n\n' + eksport)
}
