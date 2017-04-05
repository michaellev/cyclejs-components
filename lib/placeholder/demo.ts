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
      return article('.content', placeholderVnode)
    })

  return {
    DOM: vnode$
  }
}
