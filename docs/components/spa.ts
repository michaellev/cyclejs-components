import { DOMSource, body, header, section, footer, p, nav, div, a } from '@cycle/dom'
import { Location } from 'history'
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
  history: Stream<Location>
  metadata: Stream<Metadata>
}

interface Page {
  name: string
  path: string
  Component: (sources: { DOM: DOMSource }) => ({ DOM: Stream<VNode> })
  sources: { DOM: DOMSource, [x: string]: any }
}

const Spa = ({ DOM, history: history$, metadata: metadata$, rawHtmlPages: rawHtmlPages$ }: Sources) => {
  const path$ = history$
    .map(location => location.pathname)
    .startWith('/')

  const navigation$: Stream<string> = DOM
    .select('.nav .nav-item')
    .events('click')
    .map(navClick =>
      (navClick.currentTarget as HTMLAnchorElement).dataset.path as string)

  const htmlPages$: Stream<Page[]> = rawHtmlPages$
    .map((rawHtmlPages) => (
      rawHtmlPages.map(({ name, path, html }) => ({
        name,
        path,
        Component: HTMLContent,
        sources:  { DOM, html: xs.of(html) }
      }))
    ))

  const apiPage$: Stream<Page> = xs.of(
    {
      name: 'API',
      path: '/api.html',
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

  const pageSinks$ = xs
    .combine(path$, pages$)
    .map(([path, pages]) => {
      const { Component, sources } = pages
        .filter((page) => page.path === path)[0]
      return Component(sources)
    })

  const pageVnode$ = pageSinks$.map((component: { DOM: Stream<VNode> }) => component.DOM).flatten()
  const vnode$ = xs.combine(metadata$, path$, pageVnode$, pages$).map(([metadata, path, pageVnode, pages]) => (
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
              pages.map(({ name, path: pagePath }) => (
                a(
                  {
                    class: { 'nav-item': true, 'is-tab': true, 'is-active': pagePath === path },
                    dataset: { path: pagePath }
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
    DOM: vnode$,
    history: navigation$
  }
}
export default (sources: Sources) => isolate(Spa)(sources)
