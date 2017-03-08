import { DOMSource, body, section, header, label, aside, ul, li, a, } from '@cycle/dom'
import Component from './component'
import forkmeRibbon from './forkme-ribbon'
import { Stream, default as xs } from 'xstream'
import { Metadata } from '../types'

import './index.scss'

const { description: title } = require('../../package.json')

interface Sources {
  DOM: DOMSource
  metadata: Stream<Metadata>
}

export default ({ DOM, metadata: metadata$ }: Sources) => {
  const menuClicks$ = DOM.select('.menu a').events('click')
  const componentId$ = menuClicks$.map(menuClick => (
    <string | null>(<HTMLAnchorElement>menuClick.target).dataset.id)
  ).startWith(null)
  const component$ = xs.combine(
    componentId$,
    metadata$,
  ).map(([
    componentId,
    metadata
  ]) => componentId ? metadata[componentId] : null)

  const { DOM: componentVnode$ } = Component({ DOM, component: component$ })

  const vdom$ = xs.combine(
    componentId$,
    metadata$,
    componentVnode$,
  ).map(([
    componentId,
    metadata,
    componentVnode,
  ]) => (
    body(
      { props: { id: '' } },
      [
        header(
          { class: { 'section': true, 'has-text-centered': true, title: true, 'is-1': true } },
          title
        ),
        section(
          { class: { section: true, columns: true } },
          [
            componentVnode,
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
                    ...(Object.values(metadata).map(component => li(a(
                      {
                        class: { name: true, 'is-active': component.id === componentId },
                        dataset: { id: component.id }
                      },
                      component.id
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
