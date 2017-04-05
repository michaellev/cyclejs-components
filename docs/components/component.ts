import { DOMSource, div, p, code, pre, span, header } from '@cycle/dom'
import { ComponentMetadata, SourceSinkMetadata } from '../interfaces'
import { default as xs, Stream } from 'xstream'
import isolate from '@cycle/isolate'

let undef: undefined

const makeSourceSinkVnode = ({ name, direction, type, optional, descriptionHtml }: SourceSinkMetadata) => {
  return [
    header(
      '.title.is-4',
      {attrs: { id: `${name}-${direction}`}, key: name},
      [
        code('.source-sink-name', name),
        span('.tag.is-info.' + direction, direction),
        span('.tag', code(type)),
        direction === 'source' ?
          span('.tag.is-warning', optional ? 'optional' : 'required')
          : undef
      ]
    ),
    div('.content', {props: { innerHTML: descriptionHtml }})
  ]
}

interface Sources {
  component: Stream<ComponentMetadata>
  DOM: DOMSource
}

const Component = ({ DOM, component: component$ }: Sources) => {
  const demoVnode$ = component$
    .map((component) => {
      return component.demo.Component({
        DOM
      }).DOM
    }).flatten()

  const vnode$ = xs.combine(
    component$,
    demoVnode$
  ).map(([
    { id, varName, pkg, demo, sources, sinks },
    demoVnode
  ]) => {
    return div([
      div('.content',
        [
          header('.title.is-2.name', id),
          header('.title.is-3', 'Importing'),
          div('.notification.is-warning', 'The components are not yet published.'),
          header('.title.is-4', 'ECMAScript'),
          p( code('.import-example', `import ${varName} from '${pkg.name}'`)),
          header('.title.is-4', 'CommonJS'),
          p( code('.import-example', `const ${varName} = require('${pkg.name}')`)),
          header('.title.is-3', 'Sources'),
          ...[].concat.apply([], Object.values(sources).map(makeSourceSinkVnode)),
          header('.title.is-3', 'Sinks'),
          ...[].concat.apply([], Object.values(sinks).map(makeSourceSinkVnode))
        ]
      ),
      header('.title.is-3', 'Demo'),
      div('.box', demoVnode),
      header('.title.is-3', 'Demo source code'),
      pre('.box', code({ props: { innerHTML: demo.sourceHtml } }) )
    ])
  })

  return {
    DOM: vnode$
  }
}

export default (sources: Sources) => isolate(Component)(sources)
