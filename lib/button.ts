import { Stream } from 'xstream'
import isolate from '@cycle/isolate'
import { button, DOMSource } from '@cycle/dom'
import { VNode } from 'snabbdom/vnode'

export interface Sources {
  DOM: DOMSource,
  /**
   * Sets the children of the button.
   */
  children: Stream<VNode[] | string>
}

export interface Sinks {
  DOM: Stream<VNode>,
  /**
   * Emits the button presses.
   */
  presses: Stream<null>
}

export const Button = (sources: Sources ) : Sinks => {
  const presses$ = sources.DOM
    .select('button')
    .events('click')
    .mapTo(null)

  const vnode$ = sources.children.map((children: VNode[] | string) => button(children))

  const sinks = {
    DOM: vnode$,
    presses: presses$
  }

  return sinks
}

export default (sources: Sources): Sinks => isolate(Button)(sources)
