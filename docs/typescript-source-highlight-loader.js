const { dirname, basename } = require('path')

const hljs = require('highlight.js/lib/highlight')
hljs.registerLanguage('typescript', require('highlight.js/lib/languages/typescript'))

const replaceComponentImportPath = (source, name) => source
  .replace(
    /^( *import +\S+ +from +')(.)(\S*' *)$/gm,
    (match, before, dot, after) => `${before}@cycles/${name}${after}`
  )

module.exports = function (content) {
  const processed = replaceComponentImportPath(
    content,
    basename(dirname(this.resourcePath))
  )
  const { value: html } = hljs.highlight(
    'typescript',
    processed
  )
  return 'export default ' + JSON.stringify(html)
}
