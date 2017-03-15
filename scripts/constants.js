const { resolve } = require('path')

module.exports = {
  componentsDir: resolve(__dirname, '..', 'lib'),
  componentsPkgFilename: 'component.package.json'
}
