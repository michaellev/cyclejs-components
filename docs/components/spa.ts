import { DOMSource, body, header, section, footer, p, nav, div, a } from '@cycle/dom'
import { Stream, default as xs } from 'xstream'
import { Metadata, RawHTMLPage } from '../interfaces'
import API from './api'
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
      Component: API,
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
        nav(
          { class: { nav: true } },
          [
            div(
              { class: { 'nav-left': true } },
              [
                header(
                  { class: { 'nav-item': true, title: true, 'is-4': true } },
                  a({ attrs: { href: metadata.pkg.homepage } }, metadata.pkg.title)
                )
              ]
            ),
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
            ),
            div(
              { class: { 'nav-right': true } },
              [
                div(
                  { class: { 'nav-item': true } },
                  a(
                    {
                      class: { 'nav-item': true, 'github-button': true },
                      attrs: {
                        href: metadata.pkg.repository.homepage,
                        'aria-label': `Star ${metadata.pkg.repository.homepage.slice(17)} on GitHub`
                      },
                      dataset: {
                        style: 'mega',
                        countHref: `/${metadata.pkg.repository.homepage.slice(17)}/stargazers`,
                        countApi: `/repos/${metadata.pkg.repository.homepage.slice(17)}#stargazers_count`,
                        countAriaLabel: '# stargazers on GitHub'
                      }
                    },
                    'Star'
                 )
               )
              ]
            )
          ]
        ),
        section(
          { class: { section: true } },
          pageVnode
        ),
        footer(
          { class: { footer: true } },
          div(
            { class: { container: true } },
            p(metadata.pkg.tagLine)
          )
        )
      ]
    )
  ))

  return {
    DOM: vdom$
  }
}
export default (sources: Sources) => isolate(Spa)(sources)
