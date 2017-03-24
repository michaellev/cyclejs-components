const hljs = require('highlight.js/lib/highlight')
hljs.registerLanguage('typescript', require('highlight.js/lib/languages/typescript'))

const replaceComponentImportPath = (source) => source
  .replace(
    /(import \S* from ')(\.\.\/\.\.\/lib\/)(\S*)(')/g,
    (match, p1, p2, name, p4) => `${p1}@cycles/${name}${p4}`
  )

module.exports = (content) => {
  const { value: html } = hljs.highlight(
    'typescript',
    replaceComponentImportPath(content)
  )
  return 'export default ' + JSON.stringify(html)
}
