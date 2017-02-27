import { DOMSource, dl, dt, dd, pre } from '@cycle/dom'
import { DOMComponent } from '../../../src/types'
import { ComponentMetadata } from '../types'
import xs from 'xstream'

const packageName = 'cycle-web-components'

interface inputSources extends ComponentMetadata {
  DOM: DOMSource
}

const ComponentDocumentation: DOMComponent = (sources: inputSources) => {
  const propDemoSinks = sources.properties
    .map(propDoc => propDoc.Demo({DOM: sources.DOM}))

  const vdom$ = xs.combine(
    ...(propDemoSinks.map(sink => sink.DOM))
  ).map((propDemoVnodes) => ([
    dt(
      {
        attrs: { id: sources.id }
      },
      sources.name
    ),
    dd([
      dl([
        dt('Importing'),
        dd([
          dl([
            dt('ES2015'),
            dd(pre(
              { class: { importExample: true } },
              `import { ${sources.varName} } from '${packageName}'`
            )),
            dt('CommonJS'),
            dd(pre(
            { class: { importExample: true } },
            `const { ${sources.varName} } = require('${packageName}')`
            ))
          ]),
        ]),
        dt('Properties'),
        dd([
          dl([].concat.apply([], propDemoVnodes.map((vnode, i) => {
            const prop = sources.properties[i]
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
