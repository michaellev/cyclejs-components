import { DOMComponent } from '../lib/types'
import { VNode } from 'snabbdom/vnode'

export interface PropertyMetadata {
  name: string
  description: VNode
  type: string
  direction: 'source' | 'sink'
  demo: {
    Component: DOMComponent
    source: string
  }
}

export interface ComponentMetadata {
  name: string,
  id: string,
  varName: string,
  properties: PropertyMetadata[]
}
