import { DOMSource, makeDOMDriver, h1, section, menu, dl, ul, li, a } from '@cycle/dom'
import { run } from '@cycle/run'
import metadatas from './metadata'
import xs from 'xstream'
import { DOMComponent } from '../lib/types'
import ComponentDocumentation from './components/component-documentation'
import forkmeRibbon from './forkme-ribbon'

const title = 'Cycle.js Web Components Documentation'
document.title = title

const main: DOMComponent = (sources: { DOM: DOMSource }) => {
  const componentDocComponents = metadatas.map((metadata) => {
    return ComponentDocumentation({ DOM: sources.DOM, metadata: xs.of(metadata) })
  })

  const vdom$ = xs.combine(
    ...(componentDocComponents.map(component => component.DOM))
  ).map((componentDocComponentVdom) => {
    return section(
      {
        style: {
          display: 'flex'
        }
      },
      [
        dl(
          [
            ...[].concat.apply([], componentDocComponentVdom)
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
              ...(metadatas.map(metadata => li(a(
                {
                  attrs: {
                    href: '#' + metadata.id
                  }
                },
                metadata.name
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

const container = document.createElement('div')
document.body.appendChild(container)

run(main, {
  DOM: makeDOMDriver(container)
})
