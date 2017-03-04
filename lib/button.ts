import { Stream } from 'xstream'
import { button, DOMSource } from '@cycle/dom'
import isolate from '@cycle/isolate'
import { DOMComponent } from './types'
import { VNode } from 'snabbdom/vnode'

interface inputSources {
  DOM: DOMSource,
  children: Stream<VNode[] | string>
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

  const vnode$ = sources.children.map((children: VNode[] | string) => button(children))

  const sinks = {
    DOM: vnode$,
    presses: presses$
  }

  return sinks
}

export default (sources: inputSources) => isolate(Button)(sources)
