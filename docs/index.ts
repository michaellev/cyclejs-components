import { DOMSource, makeDOMDriver, h1, div, section, label, aside, dl, ul, li, a } from '@cycle/dom'
import { run } from '@cycle/run'
import metadatas from './metadata'
import xs from 'xstream'
import { DOMComponent } from '../lib/types'
import ComponentDocumentation from './components/component-documentation'
import forkmeRibbon from './forkme-ribbon'

import './index.css'

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
      { class: { section: true } },
      [
        h1(
          { class: { title: true, 'is-1': true } },
          title
        ),
        div(
          { class: { columns: true } },
          [
            div(
              {
                style: { order: '1' },
                class: { column: true }
              },
              [
                dl(
                  [
                    ...[].concat.apply([], componentDocComponentVdom)
                  ]
                ),
              ]
            ),
            aside(
              {
                style: { order: '0' },
                class: { column: true, 'is-narrow': true, menu: true }
              },
              [
                label(
                  { class: { 'menu-label': true } },
                  'Components'
                ),
                ul(
                  { class: { 'menu-list': true } },
                  [
                    ...(metadatas.map(metadata => li(a(
                      {
                        class: { name: true },
                        attrs: {
                          href: '#' + metadata.id
                        }
                      },
                      metadata.name
                    ))))
                  ]
                )
              ]
            ),
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
  DOM: makeDOMDriver(document.body)
})
