import Placeholder from '.'
import { DOMSource, article } from '@cycle/dom'

interface Sources {
  DOM: DOMSource
}

export default ({ DOM }: Sources) => {
  const {
    DOM: placeholderVnode$
  } = Placeholder({
    DOM
  })

  const vnode$ = placeholderVnode$
    .map((placeholderVnode) => {
      return article(
        { class: { content: true } },
        placeholderVnode
      )
    })

  return {
    DOM: vnode$
  }
}
