import { DOMSource, div, p, code, ul, li, a, span, header } from '@cycle/dom'
import { ComponentMetadata } from '../types'
import { default as xs, Stream } from 'xstream'
import Property from './property'
import isolate from '@cycle/isolate'

const packageName: string = require('../../package.json').name

interface Sources {
  component: Stream<ComponentMetadata | null>
  DOM: DOMSource
}

const Component = ({ DOM, component: component$ }: Sources) => {
  const rComponent$ = component$.remember()
  const tabClick$ = DOM.select('.tabs a').events('click')

  const propertyId$ = tabClick$.map(tabClick => (
    <string | null>((<HTMLAnchorElement>tabClick.currentTarget).dataset.id)
  )).startWith(null)

  const property$ = xs.combine(
    rComponent$,
    propertyId$
  ).map(([
    component,
    propertyId
  ]) => propertyId && component ? component.properties[propertyId] : null)

  const { DOM: propertyVnode$ } = Property({
    DOM,
    property: property$
  })

  const vnode$ = xs.combine(
    rComponent$,
    propertyId$,
    propertyVnode$,
  ).map(([
    component,
    propertyId,
    propertyVnode,
  ]) => (
    div(
      {
        style: { order: '1' },
        class: { content: true, column: true, 'is-10': true }
      },
      !component ? div(
        { class: { notification: true } },
        'Select a component.'
      ) : [
        header(
          {
            class: { title: true, 'is-2': true, name: true},
          },
          component.id
        ),
        header(
          { class: { title: true, 'is-3': true } },
          'Importing'
        ),
        header(
          { class: { title: true, 'is-4': true } },
          'ECMAScript'
        ),
        p(code(
          { class: { importExample: true } },
          `import { ${component.varName} } from '${packageName}'`
        )),
        header(
          { class: { title: true, 'is-4': true } },
          'CommonJS'
          ),
        p(code(
        { class: { importExample: true } },
        `const { ${component.varName} } = require('${packageName}')`
        )),
        header(
          { class: { title: true, 'is-3': true } },
          'Properties'
        ),
        div(
          { class: { tabs: true, 'is-medium': true } },
          ul(
            Object.values(component.properties).map((property) => (
              li(
                { class: { 'is-active': property.id === propertyId } },
                a(
                  { dataset: { id: property.id } },
                  [
                    property.name,
                    span(
                      {
                        class: {
                          tag: true,
                          'is-medium': true,
                          [property.direction]: true
                        }
                      },
                      property.direction
                    )
                  ]
                )
              )
            ))
          )
        ),
        propertyVnode
      ]
    )
  ))

  return {
    DOM: vnode$
  }
}

export default (sources: Sources) => isolate(Component)(sources)
