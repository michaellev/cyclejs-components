import { DOMSource, h1, div, section, label, aside, ul, li, a, } from '@cycle/dom'
import ComponentDoc from './component-documentation'
import forkmeRibbon from './forkme-ribbon'
import { Stream, default as xs } from 'xstream'
import { ComponentMetadata } from '../types'

import './index.css'

const { description: title } = require('../../package.json')

interface Sources {
  DOM: DOMSource
  metadatas: Stream<ComponentMetadata[]>
}

export default ({ DOM, metadatas: metadatas$ }: Sources) => {
  const componentDocs$ = metadatas$.map((metadatas) => (
    metadatas.map(metadata => ComponentDoc({ DOM, metadata: xs.of(metadata) }))
  ))

  const componentDocsVdoms$ = componentDocs$.map((componentDocs) => (
    xs.combine(...componentDocs.map(componentDoc => componentDoc.DOM)))
  ).flatten()

  const vdom$ = xs.combine(
    metadatas$,
    componentDocsVdoms$,
  ).map(([
    metadatas,
    componentDocsVdoms,
  ]) => (
    section(
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
                ...[].concat.apply([], componentDocsVdoms)
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
  ))

  return {
    DOM: vdom$
  }
}
