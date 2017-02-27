import { DOMSource, makeDOMDriver, h1, section, menu, dl, ul, li, a } from '@cycle/dom'
import { run } from '@cycle/run'
import componentsMetadata from './components-metadata'
import xs from 'xstream'
import { DOMComponent } from '../../src/types'
import ComponentDocumentation from './components/component-documentation'
import forkmeRibbon from './forkme-ribbon'

const title = 'Cycle.js Web Components Documentation'
document.title = title

const main: DOMComponent = (sources: { DOM: DOMSource }) => {
  const domSource = sources.DOM
  const componentDocComponents = componentsMetadata.map((doc) => {
    const sources = Object.assign({}, doc, { DOM: domSource })
    return ComponentDocumentation(sources)
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
              ...(componentsMetadata.map(doc => li(a(
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

const container = document.createElement('div')
document.body.appendChild(container)

run(main, {
  DOM: makeDOMDriver(container)
})
