import { DOMSource, dl, dt, dd, pre } from '@cycle/dom'
import { DOMComponent } from '../../../src/types'
import { ComponentMetadata } from '../types'
import xs from 'xstream'

const packageName = 'cycle-web-components'

interface inputSources {
  metadata: ComponentMetadata
  DOM: DOMSource
}

const ComponentDocumentation: DOMComponent = (sources: inputSources) => {
  const propDemoSinks = sources.metadata.properties
    .map(propMetadata => propMetadata.Demo({DOM: sources.DOM}))

  const vdom$ = xs.combine(
    ...(propDemoSinks.map(sink => sink.DOM))
  ).map((propDemoVnodes) => ([
    dt(
      {
        attrs: { id: sources.metadata.id }
      },
      sources.metadata.name
    ),
    dd([
      dl([
        dt('Importing'),
        dd([
          dl([
            dt('ES2015'),
            dd(pre(
              { class: { importExample: true } },
              `import { ${sources.metadata.varName} } from '${packageName}'`
            )),
            dt('CommonJS'),
            dd(pre(
            { class: { importExample: true } },
            `const { ${sources.metadata.varName} } = require('${packageName}')`
            ))
          ]),
        ]),
        dt('Properties'),
        dd([
          dl([].concat.apply([], propDemoVnodes.map((vnode, i) => {
            const prop = sources.metadata.properties[i]
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

  return {
    DOM: vdom$
  }
}

export default ComponentDocumentation
