import { DOMSource, body, section, div, header, label, aside, ul, li, a, } from '@cycle/dom'
import ComponentDoc from './component-documentation'
import forkmeRibbon from './forkme-ribbon'
import { Stream, default as xs } from 'xstream'
import { ComponentMetadata } from '../types'

import './index.scss'

const { description: title } = require('../../package.json')

interface Sources {
  DOM: DOMSource
  metadatas: Stream<ComponentMetadata[]>
}

export default ({ DOM, metadatas: metadatas$ }: Sources) => {
  const menuClicks$ = DOM.select('.menu a').events('click')
  const selectedName$ = menuClicks$.map(menuClick => (
    (<HTMLAnchorElement>menuClick.target).textContent)
  ).startWith('text field')
  const selected$ = xs.combine(
    selectedName$,
    metadatas$,
  ).map(([
    selectedName,
    metadatas
  ]) => {
    return metadatas.filter(metadata => metadata.name === selectedName)[0]
  })

  const { DOM: componentDocVnode$ } = ComponentDoc({ DOM, metadata: selected$ })

  const vdom$ = xs.combine(
    selectedName$,
    metadatas$,
    componentDocVnode$,
  ).map(([
    selectedName,
    metadatas,
    componentDocVnode,
  ]) => (
    body(
      { props: { id: '' } },
      [
        section(
          { class: { section: true } },
          header(
            { class: { 'has-text-centered': true, title: true, 'is-1': true } },
            title
          )
        ),
        section(
          { class: { section: true, columns: true } },
          [
            div(
              {
                style: { order: '1' },
                class: { column: true }
              },
              componentDocVnode
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
                        class: { name: true, 'is-active': metadata.name === selectedName },
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
