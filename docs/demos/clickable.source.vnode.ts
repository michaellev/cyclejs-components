import Clickable from '../../lib/clickable'
import xs, { Stream } from 'xstream'
import { p, span, button, article, code, DOMSource } from '@cycle/dom'
import { VNode } from 'snabbdom/vnode'

interface Sources {
  DOM: DOMSource
}

export default ({ DOM }: Sources) => {
  const possibleElements = [ code, span, button ]
  const inputVnode$: Stream<VNode> = xs.periodic(1000)
    .startWith(0)
    .map(n => n % possibleElements.length)
    .map(n => p(possibleElements[n]('Click me before I transform!')))

  const {
    DOM: clickableVnode$,
    click: clickableClick$
  } = Clickable({
    DOM,
    vnode: inputVnode$
  })

  const counterVnode$: Stream<VNode> = clickableClick$
    .fold((count) => count + 1, 0)
    .map(count => p(['Click count: ', code(String(count))]))

  const vnode$: Stream<VNode> = xs
    .combine(counterVnode$, clickableVnode$)
    .map(([counterVnode, clickableVnode]) => {
      return article(
        { class: { content: true } },
        [
          clickableVnode,
          counterVnode
        ]
      )
    })

  return {
    DOM: vnode$
  }
}
