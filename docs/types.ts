import { DOMComponent } from '../lib/types'
import { VNode } from 'snabbdom/vnode'

export interface PropertyMetadata {
  name: string
  description: VNode
  TSType: string
  type: 'source' | 'sink'
  Demo: DOMComponent
}

export interface ComponentMetadata {
  name: string,
  id: string,
  varName: string,
  properties: PropertyMetadata[]
}
