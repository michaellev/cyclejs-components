import { Stream } from 'xstream'
import { button, DOMSource } from '@cycle/dom'
import isolate from '@cycle/isolate'
import { VNode } from 'snabbdom/vnode'

interface Sources {
  DOM: DOMSource,
  children: Stream<VNode[] | string>
}

interface Sinks {
  DOM: Stream<VNode>,
  presses: Stream<Symbol>
}

export const press = Symbol('Button.press')

const Button = (sources: Sources ) : Sinks => {
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

export default (sources: Sources) => isolate(Button)(sources)
