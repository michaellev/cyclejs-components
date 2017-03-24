import { DOMSource, p, span, code, div, pre, header, article } from '@cycle/dom'
import { Stream, default as xs } from 'xstream'
import { PropertyMetadata } from '../interfaces'
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
    demoVnode$
  ).map(([
    property,
    demoVnode
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
          article(
            { class: { message: true, 'is-warning': true } },
            [
              div(
                { class: { 'message-header': true } },
                p('Warning')
              ),
              div(
                { class: { 'message-body': true } },
                [
                  'No components are actually published, yet. So don’t try to',
                  code('npm install'),
                  ' them.'
                ]
              )
            ]
          ),
          pre(
            { class: { box: true } },
            code({ props: { innerHTML: property.demo.sourceHtml } })
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
