import { DOMSource, span, code, div, header } from '@cycle/dom'
import { Stream, default as xs } from 'xstream'
import { PropertyMetadata } from '../interfaces'
import isolate from '@cycle/isolate'

interface Sources {
  DOM: DOMSource,
  property: Stream<PropertyMetadata | null>
}

const Property = ({ DOM, property: property$ }: Sources) => {
  const rProperty$ = property$.remember()

  const vnode$ = xs.combine(
    rProperty$
  ).map(([
    property
  ]) => (
    !property ? div(
      { class: { notification: true } },
      'Select a property.'
    ) : div(
      { class: { content: true } },
      [
        header(
          { class: { title: true, 'is-4': true, 'has-text-centered': true } },
          property.name
        ),
        div(
          { class: { level: true } },
          [
            div(
              { class: { 'level-item': true } },
              [
                span(
                  { class: { tag: true, 'is-medium': true } },
                  code(property.type)
                ),
                property.direction === 'source' ? span(
                  { class: { tag: true, 'is-medium': true } },
                  property.optional ? 'optional' : 'required'
                ) : undefined
              ]
            )
          ]
        ),
        property.description
      ]
    )
  ))

  return {
    DOM: vnode$
  }
}
export default (sources: Sources) => isolate(Property)(sources)
