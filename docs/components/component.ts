import { DOMSource, div, p, code, pre, ul, li, a, span, header } from '@cycle/dom'
import { ComponentMetadata } from '../interfaces'
import { default as xs, Stream } from 'xstream'
import Property from './property'
import isolate from '@cycle/isolate'

interface Sources {
  component: Stream<ComponentMetadata>
  DOM: DOMSource
}

const Component = ({ DOM, component: component$ }: Sources) => {
  const rComponent$ = component$.remember()
  const tabClick$ = DOM.select('.tabs a').events('click')

  const demoVnode$ = rComponent$
    .map((component) => {
      return component.demo.Component({
        DOM
      }).DOM
    }).flatten()

  const propertyId$ = tabClick$.map(tabClick => (
    ((tabClick.currentTarget as HTMLAnchorElement).dataset.id) as string | null
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
    demoVnode$,
    propertyId$,
    propertyVnode$
  ).map(([
    { id, varName, pkg, demo, properties },
    demoVnode,
    propertyId,
    propertyVnode
  ]) => {
    return div([
      div(
        { class: { content: true } },
        [
          header(
            {
              class: { title: true, 'is-2': true, name: true}
            },
            id
          ),
          header(
            { class: { title: true, 'is-3': true } },
            'Importing'
          ),
          div(
            { class: { notification: true, 'is-warning': true } },
            'The components are not yet published.'
          ),
          header(
            { class: { title: true, 'is-4': true } },
            'ECMAScript'
          ),
          p(code(
            { class: { importExample: true } },
            `import { ${varName} } from '${pkg.name}'`
          )),
          header(
            { class: { title: true, 'is-4': true } },
            'CommonJS'
            ),
          p(code(
          { class: { importExample: true } },
          `const { ${varName} } = require('${pkg.name}')`
          )),
          header(
            { class: { title: true, 'is-3': true } },
            'Properties'
          )
        ]
      ),
      div(
        { class: { tabs: true, 'is-medium': true } },
        ul(
          Object.values(properties).map((property) => (
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
      propertyVnode,
      header(
        { class: { title: true, 'is-3': true } },
        'Demo'
      ),
      div(
        { class: { box: true } },
        demoVnode
      ),
      header(
        { class: { title: true, 'is-3': true } },
        'Demo source code'
      ),
      pre(
        { class: { box: true } },
        code({ props: { innerHTML: demo.sourceHtml } })
      )
    ])
  })

  return {
    DOM: vnode$
  }
}

export default (sources: Sources) => isolate(Component)(sources)
