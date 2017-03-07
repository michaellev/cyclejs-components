import { DOMSource, code, div, pre, header } from '@cycle/dom'
import { Stream, default as xs } from 'xstream'
import{ PropertyMetadata } from '../types'

interface Sources {
  DOM: DOMSource,
  componentId: Stream<string>
  propertyMetadata: Stream<PropertyMetadata>
}

export default ({ DOM, propertyMetadata: metadata$, componentId: componentId$ }: Sources) => {
  const rMetadata$ = metadata$.remember()
  const demoVnode$ = rMetadata$.map((metadata) => metadata.Demo({ DOM }).DOM).flatten()

  const vnode$ = xs.combine(
    rMetadata$,
    componentId$,
    demoVnode$,
  ).map(([
    metadata,
    componentId,
    demoVnode,
  ]) => (
    div(
      { class: { content: true } },
      [
        header(
          { class: { title: true, 'is-4': true } },
          [
            metadata.name,
            code(
              { class: { tag: true, 'is-medium': true } },
              metadata.type
            ),
          ]
        ),
        metadata.description,
        div(
          { class: { box: true, } },
          [
            header(
              { class: { 'title': true, 'is-5': true } },
                'Demo'
            ),
            demoVnode,
            header(
              { class: { 'title': true, 'is-5': true } },
                'Source code'
            ),
            pre(
              { class: { box: true, } },
              require(`!!raw-loader!../metadata/${componentId}/demos/${metadata.direction}s/${metadata.name}`)
            )
          ]
        ),
      ]
    )
  ))

  return {
    DOM: vnode$
 }
}
