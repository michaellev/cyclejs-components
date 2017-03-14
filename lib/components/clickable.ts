import { Stream } from 'xstream'
import isolate from '@cycle/isolate'
import { DOMSource } from '@cycle/dom'
import { VNode } from 'snabbdom/vnode'

export interface Sources {
  DOM: DOMSource
  /**
   * The VNode this component will produce.
   */
  vnode: Stream<VNode>
}

export interface Sinks {
  DOM: Stream<VNode>
  DOMSource: DOMSource
  /**
   * Emits `null` on clicks.
   */
  click: Stream<null>
}

export const Clickable = ({ DOM, vnode: vnode$ }: Sources ): Sinks => {
  const DOMSource = DOM
    .select('*')

  const click$ = DOMSource
    .events('click')
    .mapTo(null)

  return {
    DOM: vnode$,
    DOMSource,
    click: click$
  }
}

export default (sources: Sources): Sinks => isolate(Clickable)(sources)

