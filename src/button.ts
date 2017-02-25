import { default as xs, Stream } from 'xstream'
import { button, DOMSource } from '@cycle/dom'
import isolate from '@cycle/isolate'
import { DOMComponent } from './types'
import { VNode } from 'snabbdom/vnode'

interface inputSources {
  DOM: DOMSource,
  children: Stream<VNode[]>
}

interface outputSinks {
  DOM: Stream<VNode>,
  presses: Stream<Symbol>
}

export const press = Symbol('Button.press')

const Button: DOMComponent = (sources: inputSources ) : outputSinks => {
  const presses$ = sources.DOM
    .select('button')
    .events('click')
    .mapTo(press)

  const children$ = sources.children || xs.of(['DEFAULT'])

  const vnode$ = children$.map(children => button(children))

  const sinks = {
    DOM: vnode$,
    presses: presses$
  }

  return sinks
}

export default (sources) => isolate(Button)(sources)
