import { DOMSource, makeDOMDriver, h1, section } from '@cycle/dom'
import { run } from '@cycle/run'
import * as componentDocs from './component-documentations'
import xs from 'xstream'
import { ComponentDocumentation } from './types'
import { DOMComponent } from '../../src/types'
import ComponentDocComponent from './component-doc-component'

document.title = 'Cycle.js Components Documentation'

const main: DOMComponent = (sources: { DOM: DOMSource }) => {
  const sinks = Object.values(componentDocs)
  .map((doc: ComponentDocumentation) => ComponentDocComponent(Object.assign({}, doc, { DOM: sources.DOM })))

  const vdom$ = xs.combine(...(sinks.map(sink => sink.DOM)))
    .map((vdoms) => {
      return section({}, [
        h1('Cycle.js Components Documentation'),
        ...vdoms
      ])
    })

  return {
    DOM: vdom$
  }
}

run(main, {
  DOM: makeDOMDriver(document.body)
})
