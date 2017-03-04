import { DOMComponent } from '../lib/types'

export interface PropertyMetadata {
  name: string
  description?: string
  TSType: string
  type: 'source' | 'sink'
  Demo?: DOMComponent
}

export interface ComponentMetadata {
  name: string,
  id: string,
  varName: string,
  properties: PropertyMetadata[]
}
