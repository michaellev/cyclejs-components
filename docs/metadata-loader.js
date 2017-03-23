const getMetadata = require('../utils/get-metadata')

module.exports = async function () {
  const callback = this.async()
  const metadata = await getMetadata()
  callback(null, 'export default ' + JSON.stringify(metadata))
}
