import { DOMSource, body, section, nav, div, header, a } from '@cycle/dom'
import forkmeRibbon from './forkme-ribbon'
import { Stream, default as xs } from 'xstream'
import { Metadata, RawHTMLPage } from '../interfaces'
import Api from './api'
import HTMLContent from './html-content'
import { VNode } from 'snabbdom/vnode'
import isolate from '@cycle/isolate'

import './index.scss'

interface Sources {
  rawHtmlPages: Stream<RawHTMLPage[]>
  DOM: DOMSource
  metadata: Stream<Metadata>
}

interface Page {
  name: string,
  Component: (sources: { DOM: DOMSource }) => ({ DOM: Stream<VNode> }),
  sources: { DOM: DOMSource, [x: string]: any }
}

const Spa = ({ DOM, metadata: metadata$, rawHtmlPages: rawHtmlPages$ }: Sources) => {
  const nav$: Stream<number> = DOM.select('.nav .nav-item').events('click')
    .map(navClick => (Number((navClick.currentTarget as HTMLAnchorElement).dataset.i)))
    .startWith(0)

  const htmlPages$: Stream<Page[]> = rawHtmlPages$
    .map((rawHtmlPages) => (
      rawHtmlPages.map(({ name, html }) => ({
        name,
        Component: HTMLContent,
        sources:  { DOM, html: xs.of(html) }
      }))
    ))

  const apiPage$: Stream<Page> = xs.of(
    {
      name: 'API',
      Component: Api,
      sources: { DOM, metadata: metadata$ }
    }
  )

  const pages$: Stream<Page[]> = xs
    .combine(
      htmlPages$,
      apiPage$
    ).map(([htmlPages, apiPage]) => (
      htmlPages.concat(apiPage)
    ))

  const page$ = xs
    .combine(nav$, pages$)
    .map(([i, pages]) => pages[i].Component(pages[i].sources))

  const pageVdom$ = page$.map((component: { DOM: Stream<VNode> }) => component.DOM).flatten()
  const vdom$ = xs.combine(metadata$, nav$, pageVdom$, pages$).map(([metadata, pageI, pageVnode, pages]) => (
    body(
      { props: { id: '' } },
      [
        header(
          { class: { 'has-text-centered': true, title: true, 'is-1': true } },
          metadata.pkg.title
        ),
        header(
          { class: { 'has-text-centered': true, subtitle: true } },
          metadata.pkg.tagLine
        ),
        nav(
          { class: { nav: true } },
          [
            div(
              { class: { 'nav-center': true } },
              pages.map(({ name }, i) => (
                a(
                  {
                    class: { 'nav-item': true, 'is-tab': true, 'is-active': i === pageI },
                    dataset: { i: String(i) }
                  },
                  name
                )
              ))
            )
          ]
        ),
        section(
          { class: { section: true } },
          pageVnode
        ),
        forkmeRibbon
      ]
    )
  ))

  return {
    DOM: vdom$
  }
}
export default (sources: Sources) => isolate(Spa)(sources)
