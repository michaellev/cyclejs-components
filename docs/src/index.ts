import { DOMSource, makeDOMDriver, h1, section, menu, ul, li, a } from '@cycle/dom'
import { run } from '@cycle/run'
import componentDocs from './component-documentations'
import xs from 'xstream'
import { ComponentDocumentation } from './types'
import { DOMComponent } from '../../src/types'
import ComponentDocComponent from './component-doc-component'
import forkmeRibbon from './forkme-ribbon'

const title = 'Cycle.js Web Components Documentation'
document.title = title

const main: DOMComponent = (sources: { DOM: DOMSource }) => {
  const domSource = sources.DOM
  const componentDocComponents = componentDocs.map((doc: ComponentDocumentation) => {
    const sources = Object.assign({}, doc, { DOM: domSource })
    return ComponentDocComponent(sources)
  })

  const vdom$ = xs.combine(
    ...(componentDocComponents.map(component => component.DOM))
  ).map((vdoms) => {
    return section(
      {
        style: {
          display: 'flex'
        }
      },
      [
        section(
          [
            ...vdoms
          ]
        ),
        menu(
          {
            style: {
              order: '-1',
              flexBasis: '20%'
            }
          },
          [
            h1(title),
            ul([
              ...(componentDocs.map(doc => li(a(
                {
                  attrs: {
                    href: '#' + doc.id
                  }
                },
                doc.name
              ))))
            ])
          ]
        ),
        forkmeRibbon
      ]
    )
  })

  return {
    DOM: vdom$
  }
}

run(main, {
  DOM: makeDOMDriver(document.body)
})
