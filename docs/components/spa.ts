import { DOMSource, body, header, section, footer, p, nav, div, a } from '@cycle/dom'
import { Location } from 'history'
import { Stream, default as xs } from 'xstream'
import { Metadata, RawHTMLPage } from '../interfaces'
import Components from './components'
import HTMLContent from './html-content'
import { VNode } from 'snabbdom/vnode'
import isolate from '@cycle/isolate'
import SwitchPathRouter, { RouteDefinitions } from '../../lib/switch-path-router'

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

const Spa = ({
  DOM,
  history: history$,
  metadata: metadata$,
  rawHtmlPages: rawHtmlPages$
}: Sources) => {
  const path$ = history$
    .map(location => location.pathname)
    .startWith('/')

  const navigation$: Stream<string> = DOM
    .select('.is-page-link')
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

  const componentsPage$: Stream<Page> = xs.of(
    {
      name: 'Components',
      path: '/components',
      Component: Components,
      sources: { DOM, metadata: metadata$ }
    }
  )

  const pages$: Stream<Page[]> = xs
    .combine(htmlPages$, componentsPage$)
    .map(([htmlPages, componentsPage]) => htmlPages.concat(componentsPage))

  const routes$: Stream<RouteDefinitions> = pages$
    .map((pages) =>
      pages.reduce((routes, page) => {
        routes[page.path] = page
        return routes
      }, {} as RouteDefinitions))

  const {
    value: currentPage$
  } = SwitchPathRouter({
    path: path$,
    routes: routes$
  })

  const pageSinks$ = currentPage$
    .map(({ Component, sources}) => Component(sources))

  const pageVnode$ = pageSinks$
    .map((component: { DOM: Stream<VNode> }) => component.DOM)
    .flatten()

  const vnode$ = xs
    .combine(metadata$, path$, pageVnode$, pages$)
    .map(([metadata, path, pageVnode, pages]) => {
      return body(
        { props: { id: '' } },
        [
          nav('.nav',
            [
              div('.nav-left', [header('.nav-item.title.is-4', metadata.pkg.title)]),
              div('.nav-center',
                pages.map(({ name, path: pagePath }) => (
                  a('.nav-item.is-tab.is-page-link',
                    {
                      class: {'is-active': pagePath === path},
                      dataset: { path: pagePath }
                    },
                    name
                  )
                ))
              ),
              div('.nav-right',
                [
                  div('.nav-item',
                    a('.nav-item.github-button',
                      {
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
          section('.section', pageVnode),
          footer('.footer', div('.container', p(metadata.pkg.tagLine)))
        ]
      )
    })

  return {
    DOM: vnode$,
    history: navigation$
  }
}
export default (sources: Sources) => isolate(Spa)(sources)
