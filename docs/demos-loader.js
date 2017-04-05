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
        varName
      }
    })

  const imports = demos
    .map(({ path, varName }) => `import ${varName} from '${path}'`)
    .join('\n')

  const eksport = 'export default {\n' + demos
    .map(({ id, varName }) => `  '${id}': ${varName}`)
    .join(',\n') + '\n}'

  callback(null, imports + '\n\n' + eksport)
}
