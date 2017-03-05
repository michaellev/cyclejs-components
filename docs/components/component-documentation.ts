import { DOMSource, dl, dt, dd, code } from '@cycle/dom'
import { DOMComponent } from '../../lib/types'
import { ComponentMetadata, PropertyMetadata } from '../types'
import { default as xs, Stream } from 'xstream'
import { VNode } from 'snabbdom/vnode'


declare const require: any
const { name: packageName } = require('../../package.json')

interface inputSources {
  metadata: Stream<ComponentMetadata>
  DOM: DOMSource
}

const ComponentDocumentation: DOMComponent = (sources: inputSources) => {
  const vnode$ = sources.metadata
    .map((metadata) => {
      const propDemoVnode$s = metadata.properties
        .map(propMetadata => propMetadata.Demo ? propMetadata.Demo({ DOM: sources.DOM }).DOM : xs.of(undefined))

      return xs.combine(
        ...propDemoVnode$s
      ).map((propDemoVnodes) => ([
        dt(
          {
            class: { title: true, 'is-2': true, name: true},
            attrs: { id: metadata.id }
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
              dl([].concat.apply([], metadata.properties.map((propertyMetadata, i) => {
                const demoVnode = propDemoVnodes[i]
                return [
                  dt(propertyMetadata.name),
                  dd(mkPropertyDocVnode(propertyMetadata, demoVnode))
                ]
              })))
            ])
          ])
        ])
      ]))
    }).flatten()

  return {
    DOM: vnode$
  }
}

const mkPropertyDocVnode = (propertyMetadata: PropertyMetadata, demoVnode: VNode) => (
  dl([
    dt('name'),
    dd(code(propertyMetadata.name)),
    dt('description'),
    dd(propertyMetadata.description),
    dt('direction'),
    dd(
      { class: { tag: true } },
      propertyMetadata.type
    ),
    dt('type'),
    dd(code(propertyMetadata.TSType)),
    ...(demoVnode ? [dt('demo'), dd(demoVnode)] : [])
  ])
)

export default ComponentDocumentation
