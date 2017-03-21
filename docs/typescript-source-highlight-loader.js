const hljs = require('highlight.js/lib/highlight')
hljs.registerLanguage('typescript', require('highlight.js/lib/languages/typescript'))

module.exports = (content) => {
  const html = hljs.highlight('typescript', content).value
  return 'export default ' + JSON.stringify(html)
}
