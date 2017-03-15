import List from '../../lib/list'
import xs, { Stream } from 'xstream'
import { article, DOMSource, ul, li } from '@cycle/dom'
import { VNode } from 'snabbdom/vnode'

interface Sources {
  DOM: DOMSource
}

export default ({ DOM }: Sources) => {
  const {
    DOM: listVnode$
  } = List({
    DOM,
    parentVnode: xs.of(ul()),
    childrenVnodes: xs.of([
      xs.of(li('one')),
      xs.of(li('two'))
    ])
  })

  const vnode$: Stream<VNode> = xs
    .combine(
      listVnode$
    )
    .map(([
      listVnode
    ]) => (
      article(
        { class: { content: true } },
        [
          listVnode
        ]
      )
    ))

  return {
    DOM: vnode$
  }
}
