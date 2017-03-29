import { DOMSource, body, header, section, footer, p, nav, div, a } from '@cycle/dom'
import { Location } from 'history'
import { Stream, default as xs } from 'xstream'
import { Metadata, RawHTMLPage } from '../interfaces'
import API from './api'
import HTMLContent from './html-content'
import { VNode } from 'snabbdom/vnode'
import isolate from '@cycle/isolate'
import { parse as queryString } from 'query-string'

import './index.scss'

interface Sources {
  rawHtmlPages: Stream<RawHTMLPage[]>
  DOM: DOMSource
  history: Stream<Location>
  metadata: Stream<Metadata>
}

interface Page {
  name: string
  id: string
  Component: (sources: { DOM: DOMSource }) => ({ DOM: Stream<VNode> })
  sources: { DOM: DOMSource, [x: string]: any }
}

const Spa = ({
  DOM,
  history: history$,
  metadata: metadata$,
  rawHtmlPages: rawHtmlPages$
}: Sources) => {
  const pageId$ = history$
    .map(location => queryString(location.search).page || 'index')

  const navigation$: Stream<string> = DOM
    .select('.is-page-link')
    .events('click')
    .map(navClick => {
      const pageId = (navClick.currentTarget as HTMLAnchorElement)
        .dataset.pageId as string
      if (pageId === 'index') {
        return '/'
      }
      return '?page=' + pageId
    })

  const htmlPages$: Stream<Page[]> = rawHtmlPages$
    .map((rawHtmlPages) => (
      rawHtmlPages.map(({ name, id, html }) => ({
        name,
        id,
        Component: HTMLContent,
        sources:  { DOM, html: xs.of(html) }
      }))
    ))

  const apiPage$: Stream<Page> = xs.of(
    {
      name: 'API',
      id: 'api',
      Component: API,
      sources: { DOM, metadata: metadata$ }
    }
  )

  const pages$: Stream<Page[]> = xs
    .combine(htmlPages$, apiPage$)
    .map(([htmlPages, apiPage]) => htmlPages.concat(apiPage))

  const pageSinks$ = xs
    .combine(pageId$, pages$)
    .map(([pageId, pages]) => {
      const { Component, sources } = pages
        .filter(page => page.id === pageId)[0]
      return Component(sources)
    })

  const pageVnode$ = pageSinks$
    .map((component: { DOM: Stream<VNode> }) => component.DOM)
    .flatten()

  const vnode$ = xs
    .combine(metadata$, pageId$, pageVnode$, pages$)
    .map(([metadata, pageId, pageVnode, pages]) => {
      return body(
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
                pages.map((page) => (
                  a(
                    {
                      class: {
                        'nav-item': true,
                        'is-tab': true,
                        'is-active': page.id === pageId,
                        'is-page-link': true
                      },
                      dataset: { pageId: page.id }
                    },
                    page.name
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
    })

  return {
    DOM: vnode$,
    history: navigation$
  }
}
export default (sources: Sources) => isolate(Spa)(sources)
