import xs, { Stream } from 'xstream'
import isolate from '@cycle/isolate'
import { DOMSource } from '@cycle/dom'
import { VNode } from 'snabbdom/vnode'

export interface Sources {
  DOM: DOMSource
  /**
   * Parent VNode stream. Children will be contained in the provided parent.
   */
  parentVnode: Stream<VNode>
  /**
   * Children VNode streams. Children will be contained in the provided parent.
   */
  childrenVnodes: Stream<Array<Stream<VNode>>>
}

export interface Sinks {
  DOM: Stream<VNode>
  DOMSource: DOMSource
}

export const List = ({
  DOM: DOMSource,
  parentVnode: parentVnode$,
  childrenVnodes: childrenVnodes$s$
}: Sources): Sinks => {

  const childrenVnodes$: Stream<VNode[]> = childrenVnodes$s$
    .map((childrenVnodes$s) => (
      xs
        .combine(...childrenVnodes$s)
    ))
    .flatten()

  const vnode$ = xs
    .combine(
      parentVnode$,
      childrenVnodes$
    )
    .map(([parentVnode, childrenVnodes]) => {
      parentVnode.children = childrenVnodes
      return parentVnode
    })

  return {
    DOM: vnode$,
    DOMSource
  }
}

export default (sources: Sources): Sinks => isolate(List)(sources)
