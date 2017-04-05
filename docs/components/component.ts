import { DOMSource, div, p, code, span, header } from '@cycle/dom'
import { ComponentMetadata, SourceSinkMetadata } from '../interfaces'
import { default as xs, Stream } from 'xstream'
import isolate from '@cycle/isolate'

let undef: undefined

const makeSourceSinkVnode = ({ name, direction, type, optional, descriptionHtml }: SourceSinkMetadata) => {
  return [
    header(
      {
        attrs: { id: `${name}-${direction}`},
        key: name,
        class: { title: true, 'is-4': true }
      },
      [
        code({ class: { 'source-sink-name': true } }, name),
        span(
          { class: { tag: true, 'is-info': true, [direction]: true } },
          direction
        ),
        span(
          { class: { tag: true } },
          code(type)
        ),
        direction === 'source' ? span(
          { class: { tag: true , 'is-warning': true } },
          optional ? 'optional' : 'required'
        ) : undef
      ]
    ),
    div({
      class: { content: true },
      props: { innerHTML: descriptionHtml }
    })
  ]
}

interface Sources {
  component: Stream<ComponentMetadata>
  DOM: DOMSource
}

const Component = ({ DOM, component: component$ }: Sources) => {
  const demoVnode$ = component$
    .map((component) => {
      return component.DemoComponent({
        DOM
      }).DOM
    }).flatten()

  const vnode$ = xs.combine(
    component$,
    demoVnode$
  ).map(([
    { id, varName, pkg, sources, sinks },
    demoVnode
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
            'Sources'
          ),
          ...[].concat.apply([], Object.values(sources).map(makeSourceSinkVnode)),
          header(
            { class: { title: true, 'is-3': true } },
            'Sinks'
          ),
          ...[].concat.apply([], Object.values(sinks).map(makeSourceSinkVnode))
        ]
      ),
      header(
        { class: { title: true, 'is-3': true } },
        'Demo'
      ),
      div(
        { class: { box: true } },
        demoVnode
      )
    ])
  })

  return {
    DOM: vnode$
  }
}

export default (sources: Sources) => isolate(Component)(sources)
