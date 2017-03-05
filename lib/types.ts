import { DOMSource } from '@cycle/dom'
import { Stream } from 'xstream'
import { VNode } from 'snabbdom/vnode'

export interface DOMComponent {
  (
    sources: {
      DOM: DOMSource,
      [x: string]: any
    }
  ): {
    DOM: Stream<VNode | VNode[]>,
    [x: string]: any
  }
}