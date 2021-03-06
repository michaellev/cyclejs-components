import { DOMSource, p } from '@cycle/dom'
import { VNode } from 'snabbdom/vnode'
import isolate from '@cycle/isolate'
import xs, { Stream } from 'xstream'

export interface Sources {
  /**
   * Here is a description of this source.
   *
   * As you can see, this is a `DOMSource`.
   */
  DOM: DOMSource
}

export interface Sinks {
  DOM: Stream<VNode>
}

const Placeholder = (sources: Sources): Sinks => {
  return {
    DOM: xs.of(p('Hi!'))
  }
}

export default (sources: Sources): Sinks => isolate(Placeholder)(sources)
