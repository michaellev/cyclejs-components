import { DOMSource, span, code, div, pre, header } from '@cycle/dom'
import { Stream, default as xs } from 'xstream'
import { PropertyMetadata } from '../types'
import isolate from '@cycle/isolate'

interface Sources {
  DOM: DOMSource,
  property: Stream<PropertyMetadata | null>
}

const Property = ({ DOM, property: property$ }: Sources) => {
  const rProperty$ = property$.remember()
  const demoVnode$ = rProperty$.map((property) => property && property.demo ? property.demo.Component({ DOM }).DOM : xs.of(null)).flatten()

  const vnode$ = xs.combine(
    rProperty$,
    demoVnode$,
  ).map(([
    property,
    demoVnode,
  ]) => (
    !property ? div(
      { class: { notification: true } },
      'Select a property.'
    ) : div(
      { class: { content: true } },
      [
        header(
          { class: { title: true, 'is-4': true, 'has-text-centered': true } },
          property.name,
        ),
        div(
          { class: { level: true } },
          [
            div(
              { class: { 'level-item': true, } },
              [
                span(
                  { class: { tag: true, 'is-medium': true } },
                  code(property.type)
                ),
                span(
                  { class: { tag: true, 'is-medium': true } },
                  property.mandatory ? 'mandatory' : 'optional'
                ),
              ]
            ),
          ]
        ),
        property.description,
        ...(!property.demo ? [] : [
          header(
            { class: { 'title': true, 'is-5': true } },
              'Demo'
          ),
          div(
            { class: { box: true } },
            demoVnode
          ),
          header(
            { class: { 'title': true, 'is-5': true } },
              'Demo source code'
          ),
          pre(
            { class: { box: true, } },
            code(property.demo.source)
          )
        ])
      ]
    )
  ))

  return {
    DOM: vnode$
 }
}
export default (sources: Sources) => isolate(Property)(sources)
