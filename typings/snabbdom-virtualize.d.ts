declare module 'snabbdom-virtualize' {
  import { VNode } from 'snabbdom/vnode'
  export const virtualizeString: (vnode: string) => VNode
}

