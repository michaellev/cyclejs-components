import Clickable from '../../lib/clickable'
import xs, { Stream } from 'xstream'
import { p, article, DOMSource } from '@cycle/dom'
import { VNode } from 'snabbdom/vnode'

interface Sources {
  DOM: DOMSource
}

export default ({ DOM }: Sources) => {
  const {
    click: click$,
    DOM: clickableVnode$
  } = Clickable({
    DOM,
    vnode: xs.of(p('I can be clicked.'))
  })

  const clickCount$: Stream<number> = click$
    .fold(count => count + 1, 0)

  const vnode$: Stream<VNode> = xs
    .combine(clickCount$, clickableVnode$)
    .map(([clickCount, clickableVnode]) => (
      article(
        { class: { content: true } },
        [
          clickableVnode,
          p(`The one above me was clicked ${clickCount} times.`)
        ]
      )
    ))

  return {
    DOM: vnode$
  }
}
