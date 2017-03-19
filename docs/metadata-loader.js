const getMetadata = require('../utils/get-metadata')

module.exports = async function () {
  const callback = this.async()
  const { components } = await getMetadata()
  callback(null, 'export default ' + JSON.stringify(components))
}
