import { DOMSource, body, nav, div, header, a, } from '@cycle/dom'
import forkmeRibbon from './forkme-ribbon'
import { Stream, default as xs } from 'xstream'
import { Metadata } from '../types'
import Api from './api'
import VirtualizeHtml from './virtualize-html'
import { VNode } from 'snabbdom/vnode'
import isolate from '@cycle/isolate'

import './index.scss'

const { description: title } = require('../../package.json')

interface Sources {
  readmeHtml: Stream<string>
  DOM: DOMSource
  metadata: Stream<Metadata>
}

interface Page {
  name: string,
  Component: (sources: { DOM: DOMSource }) => ({ DOM: Stream<VNode> }),
  sources: { DOM: DOMSource, [x: string]: any }
}

const Spa = ({ DOM, metadata: metadata$, readmeHtml: readmeHtml$ }: Sources) => {
  const nav$ = DOM.select('.nav .nav-item').events('click')
    .map(navClick => (<string>(<HTMLAnchorElement>navClick.currentTarget).dataset.id))
    .startWith('readme')

    const pages: { [id: string]: Page } = {
      readme: {
        name: 'README',
        Component: VirtualizeHtml,
        sources: { DOM, html: readmeHtml$ }
      },
      api: {
        name: 'API',
        Component: Api,
        sources: { DOM, metadata: metadata$ }
      }
    }

  const page$ = nav$.map(id => pages[id].Component(pages[id].sources))

  const pageVdom$ = page$.map((component: { DOM: Stream<VNode> }) => component.DOM).flatten()
  const vdom$ = xs.combine(nav$, pageVdom$).map(([pageId, pageVnode]) => (
    body(
      { props: { id: '' } },
      [
        header(
          { class: { 'section': true, 'has-text-centered': true, title: true, 'is-1': true } },
          title
        ),
        nav(
          { class: { nav: true } },
          [
            div(
              { class: { 'nav-center': true } },
              Object.entries(pages).map(([id, { name }]) => (
                a(
                  {
                    class: { 'nav-item': true, 'is-tab': true, 'is-active': id === pageId },
                    dataset: { id }
                  },
                  name
                )
              ))
            )
          ]
        ),
        pageVnode,
        forkmeRibbon
      ]
    )
  ))

  return {
    DOM: vdom$
  }
}
export default (sources: Sources) => isolate(Spa)(sources)
