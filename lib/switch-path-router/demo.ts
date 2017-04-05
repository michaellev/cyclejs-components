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
        div(
          { class: { columns: true } },
          [
            button({
              class: { column: true, 'is-narrow': true, button: true },
              dataset: { action: 'back' }
            }, '<'),
            button({
              class: { column: true, 'is-narrow': true, button: true },
              dataset: { action: 'forward' }
            }, '>'),
            button({
              class: { column: true, 'is-narrow': true, button: true }
            }, '⟳'),
            div(
              { class: { column: true, input: true } },
              [
                'https://example.com',
                b(path)
              ]
            )
          ]
        ),
        div(
          {
            class: { columns: true },
            style: { height: '28rem' }
          },
          [
            div(
              { class: { column: true, 'is-narrow': true, menu: true } },
              [
                label({ class: { 'menu-label': true } }, 'Pages'),
                ul(
                  { class: { 'menu-list': true } },
                  [
                    li(a({ dataset: { path: '/' } }, 'Home')),
                    li(a({ dataset: { path: '/features' } }, 'Features')),
                    li(a({ dataset: { path: '/the-team' } }, 'The team'))
                  ]
                )
              ]
            ),
            div(
              {
                style: {
                  fontSize: '600%', fontWeight: 'lighter', fontFamily: 'serif',
                  textAlign: 'justify', overflow: 'scroll', wordBreak: 'break-all'
                },
                class: { column: true, content: true }
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
