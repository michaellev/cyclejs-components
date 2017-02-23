import { DOMSource, section, h2, pre } from '@cycle/dom'
import { DOMComponent } from '../../src/types'
import { ComponentDocumentation } from './types'
import { VNode } from 'snabbdom/vnode'

const packageName = 'cycle-web-components'

interface inputSources extends ComponentDocumentation {
  DOM: DOMSource
}

const ComponentDocComponent: DOMComponent = (sources: inputSources) => {
  const demo = sources.Demo({ DOM: sources.DOM })
  const vdom$ = demo.DOM.map((demo: VNode) => (
    section([
      h2({ attrs: { id: sources.id } }, sources.name),
      pre(
        { class: { importExample: true } },
        `import { ${sources.varName} } from '${packageName}'`
      ),
      pre(
        { class: { importExample: true } },
        `const { ${sources.varName} } = require('${packageName}')`
      ),
      demo
    ])
  ))
  return {
    DOM: vdom$
  }
}

export default ComponentDocComponent
