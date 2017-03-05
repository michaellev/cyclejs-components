import { DOMSource, dl, dt, dd, code } from '@cycle/dom'
import { DOMComponent } from '../../lib/types'
import { ComponentMetadata } from '../types'
import { default as xs, Stream } from 'xstream'


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
            dt('Importing'),
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
            dt('Properties'),
            dd([
              dl([].concat.apply([], propDemoVnodes.map((vnode, i) => {
                const prop = metadata.properties[i]
                return [
                  dt(code(prop.name)),
                  dd(
                    dl([
                      dt('description'),
                      dd(prop.description),
                      dt('direction'),
                      dd(
                        { class: { tag: true } },
                        prop.type
                      ),
                      dt('type'),
                      dd(code(prop.TSType)),
                      ...(vnode ? [dt('demo'), dd(vnode)] : [])
                    ])
                  )
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

export default ComponentDocumentation
