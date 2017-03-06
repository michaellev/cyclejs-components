import { DOMSource, code, div, header, span } from '@cycle/dom'
import { Stream, default as xs } from 'xstream'
import{ PropertyMetadata } from '../types'

interface Sources {
  DOM: DOMSource,
  propertyMetadata: Stream<PropertyMetadata>
}

export default ({ DOM, propertyMetadata: metadata$ }: Sources) => {
  const rMetadata$ = metadata$.remember()
  const demoVnode$ = rMetadata$.map((metadata) => (
    metadata.Demo ? metadata.Demo({ DOM }).DOM : xs.of(undefined)
  )).flatten()

  const vnode$ = xs.combine(
    rMetadata$,
    demoVnode$,
  ).map(([
    metadata,
    demoVnode
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
              metadata.TSType
            ),
          ]
        ),
        metadata.description,
        demoVnode ? div(
          { class: { card: true, } },
          [
            header(
              { class: { 'card-header': true } },
              span(
                { class: { 'card-header-title': true } },
                'Demo'
              ),
            ),
            div(
              { class: { 'card-content': true } },
              demoVnode
            )
          ]
        ) : undefined,
      ]
    )
  ))

  return {
    DOM: vnode$
 }
}
