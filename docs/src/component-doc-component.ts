import { DOMSource, section, h2, h3, dl, dt, dd, pre } from '@cycle/dom'
import { DOMComponent } from '../../src/types'
import { ComponentDocumentation, PropertyDocumentation } from './types'
import { VNode } from 'snabbdom/vnode'
import xs from 'xstream'

const packageName = 'cycle-web-components'

interface inputSources extends ComponentDocumentation {
  DOM: DOMSource
}

const ComponentDocComponent: DOMComponent = (sources: inputSources) => {
  const propDocSinks = sources.properties
    .map(prop => prop.Documentation({DOM: sources.DOM}))
  const vdom$ = xs.combine(
    ...(propDocSinks.map(sink => sink.DOM))
  ).map((propDocVnodes) => dl([
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
          dl([].concat.apply([], propDocVnodes.map((vnode, i) => {
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

export default ComponentDocComponent
