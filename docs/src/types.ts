import { DOMComponent } from '../../src/types'

export interface PropertyDocumentation {
  name: string
  description?: string
  TSType: string
  type: 'source' | 'sink'
  Demo: DOMComponent
}

export interface ComponentDocumentation {
  name: string,
  id: string,
  varName: string,
  properties: PropertyDocumentation[]
}
