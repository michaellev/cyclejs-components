import { DOMSource, div, p, code, ul, li, a, span, header } from '@cycle/dom'
import { ComponentMetadata } from '../types'
import { default as xs, Stream } from 'xstream'
import Property from './property'

declare const require: any
const { name: packageName } = require('../../package.json')

interface Sources {
  metadata: Stream<ComponentMetadata>
  DOM: DOMSource
}

export default ({ DOM, metadata: metadata$ }: Sources) => {
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

  const id$ = rMetadata$.map(metadata => metadata.id)

  const { DOM: propertyVnode$ } = Property({
    DOM,
    propertyMetadata: selectedProperty$,
    componentId: id$
  })

  const vnode$ = xs.combine(
    rMetadata$,
    selectedPropertyI$,
    propertyVnode$,
  ).map(([
    metadata,
    selectedPropertyI,
    propertyVnode,
  ]) => (
    div(
      {
        style: { order: '1' },
        class: { content: true, column: true }
      },
      [
        header(
          {
            class: { title: true, 'is-2': true, name: true},
          },
          metadata.name
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
          `import { ${metadata.varName} } from '${packageName}'`
        )),
        header(
          { class: { title: true, 'is-4': true } },
          'CommonJS'
          ),
        p(code(
        { class: { importExample: true } },
        `const { ${metadata.varName} } = require('${packageName}')`
        )),
        header(
          { class: { title: true, 'is-3': true } },
          'Properties'
        ),
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
                          [propertyMetadata.direction]: true
                        }
                      },
                      propertyMetadata.direction
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
