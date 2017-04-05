import { VNode } from 'snabbdom/vnode'
import xs, { Stream } from 'xstream'
import isolate from '@cycle/isolate'
import { DOMSource, article, div, button, b, label, ul, li, a, p } from '@cycle/dom'
import SwitchPathRouter from '.'

const routes$ = xs.of({
  '/': p('Reasonaboutability is us.'),
  '/features': p('Many great features. We do it all, really.'),
  '/the-team': p('We are quite alright, some would say.')
})

const back = Symbol('back')
const forward = Symbol('forward')

interface Sources {
  DOM: DOMSource
}

interface Sinks {
  DOM: Stream<VNode>
}

const RouterDemo = ({
  DOM
}: Sources): Sinks => {
  const menuClick$ = DOM
    .select('[data-path]')
    .events('click')
    .map((clickEvent) =>
      (clickEvent.currentTarget as HTMLAnchorElement).dataset.path as string)

  const back$ = DOM
    .select('[data-action=back]')
    .events('click')
    .mapTo(back)

  const forward$ = DOM
    .select('[data-action=forward]')
    .events('click')
    .mapTo(forward)

  const path$ = xs
    .merge(menuClick$, back$, forward$)
    .fold(({ position, history, path }, action) => {
      if (typeof action === 'string') {
        if (action !== history[position]) {
          history.splice(position + 1)
          history.push(action)
          position ++
        }
      } else if (action === back) {
        if (position > 0) {
          position --
        }
      } else if (action === forward) {
        if (position + 1 < history.length) {
          position ++
        }
      }
      path = history[position]
      return { position, history, path }
    }, { position: 0, history: ['/'], path: '/' })
    .map(({ path }) => path)

  const {
    path: matchPath$,
    value: page$
  } = SwitchPathRouter({
    path: path$,
    routes: routes$
  })

  const vnode$ = xs
  .combine(matchPath$, page$)
  .map(([path, page]) => {
    return article(
      [
        div('.columns',
          [
            button('.column.is-narrow.button', {dataset: { action:    'back' }}, '<'),
            button('.column.is-narrow.button', {dataset: { action: 'forward' }}, '>'),
            button('.column.is-narrow.button', '⟳'),
            div('.column.input', [ 'https://example.com', b(path) ])
          ]
        ),
        div(
          '.columns',
          { style: { height: '28rem' } },
          [
            div('.column.is-narrow.menu',
              [
                label('.menu-label', 'Pages'),
                ul('.menu-list',
                  [
                    li(a({ dataset: { path: '/' } }, 'Home')),
                    li(a({ dataset: { path: '/features' } }, 'Features')),
                    li(a({ dataset: { path: '/the-team' } }, 'The team'))
                  ]
                )
              ]
            ),
            div('.column.content',
              {
                style: {
                  fontSize: '600%', fontWeight: 'lighter', fontFamily: 'serif',
                  textAlign: 'justify', overflow: 'scroll', wordBreak: 'break-all'
                }
              },
              page
            )
          ]
        )
      ]
    )
  })

  return {
    DOM: vnode$
  }
}

export default (sources: Sources): Sinks => isolate(RouterDemo)(sources)
