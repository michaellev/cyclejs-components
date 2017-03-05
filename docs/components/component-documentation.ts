import { DOMSource, div, dl, dt, dd, code, ul, li, a, span } from '@cycle/dom'
import { DOMComponent } from '../../lib/types'
import { ComponentMetadata } from '../types'
import { default as xs, Stream } from 'xstream'
import PropertyDoc from './property-documentation'
// import { VNode } from 'snabbdom/vnode'


declare const require: any
const { name: packageName } = require('../../package.json')

interface Sources {
  metadata: Stream<ComponentMetadata>
  DOM: DOMSource
}

const ComponentDocumentation: DOMComponent = ({ DOM, metadata: metadata$ }: Sources) => {
  const rMetadata$ = metadata$.remember()
  const tabClick$ = DOM.select('.tabs a').events('click')

  const selectedPropertyI$ = tabClick$.map(tabClick => (
    parseInt(<string>((<HTMLAnchorElement>tabClick.currentTarget).dataset.i))
  )).startWith(0)

  const selectedProperty$ = xs.combine(
    rMetadata$,
    selectedPropertyI$
  ).map(([
    metadata,
    selectedPropertyI
  ]) => metadata.properties[selectedPropertyI])

  const { DOM: propertyDocVnode$ } = PropertyDoc({ DOM, propertyMetadata: selectedProperty$ })

  const vnode$ = xs.combine(
    rMetadata$,
    selectedPropertyI$,
    propertyDocVnode$,
  ).map(([
    metadata,
    selectedPropertyI,
    propertyDocVnode,
  ]) => (
    div([
      dt(
        {
          class: { title: true, 'is-2': true, name: true},
        },
        metadata.name
      ),
      dd([
        dl([
          dt(
            { class: { title: true, 'is-3': true } },
            'Importing'
          ),
          dd([
            dl([
              dt('ECMAScript'),
              dd(code(
                { class: { importExample: true } },
                `import { ${metadata.varName} } from '${packageName}'`
              )),
              dt('CommonJS'),
              dd(code(
              { class: { importExample: true } },
              `const { ${metadata.varName} } = require('${packageName}')`
              ))
            ]),
          ]),
          dt(
            { class: { title: true, 'is-3': true } },
            'Properties'
          ),
          dd([
            div(
              { class: { tabs: true, 'is-medium': true } },
              ul(
                metadata.properties.map((propertyMetadata, i) => (
                  li(
                    { class: { 'is-active': i === selectedPropertyI } },
                    a(
                      { dataset: { i: String(i) } },
                      [
                        propertyMetadata.name,
                        span(
                          {
                            class: {
                              tag: true,
                              'is-medium': true,
                              [propertyMetadata.type]: true
                            }
                          },
                          propertyMetadata.type
                        )
                      ]
                    )
                  )
                ))
              )
            ),
            propertyDocVnode
          ])
        ])
      ])
    ])
  ))

  return {
    DOM: vnode$
  }
}

export default ComponentDocumentation
