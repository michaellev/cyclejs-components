import { DOMSource, dl, dt, dd, pre } from '@cycle/dom'
import { DOMComponent } from '../../../src/types'
import { ComponentMetadata } from '../types'
import { default as xs, Stream } from 'xstream'
import { VNode } from 'snabbdom/vnode'

const packageName = 'cycle-web-components'

interface inputSources {
  metadata: Stream<ComponentMetadata>
  DOM: DOMSource
}

const ComponentDocumentation: DOMComponent = (sources: inputSources) => {
  const vnode$ = sources.metadata
    .map((metadata) => {
      const propDemoVnode$s: Stream<VNode | VNode[]>[] = metadata.properties
        .map(propMetadata => propMetadata.Demo({ DOM: sources.DOM }).DOM)

      return xs.combine(
        ...propDemoVnode$s
      ).map((propDemoVnodes) => ([
        dt(
          {
            attrs: { id: metadata.id }
          },
          metadata.name
        ),
        dd([
          dl([
            dt('Importing'),
            dd([
              dl([
                dt('ES2015'),
                dd(pre(
                  { class: { importExample: true } },
                  `import { ${metadata.varName} } from '${packageName}'`
                )),
                dt('CommonJS'),
                dd(pre(
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
                  dt(prop.name),
                  dd(
                    dl([
                      ...(prop.description ? [dt('description'), dd(prop.description)] : []),
                      dt('direction'),
                      dd(prop.type),
                      dt('type'),
                      dd(prop.TSType),
                      dt('demo'),
                      dd(vnode)
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
