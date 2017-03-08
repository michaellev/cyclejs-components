import { DOMComponent } from '../lib/types'

export interface Metadata {
  [id: string]: ComponentMetadata
}

export interface ComponentMetadata {
  id: string
  varName: string
  properties: {
    [id: string]: SourceMetadata | SinkMetadata
  }
}

export interface PropertyMetadata {
  id: string
  name: string
  parentId: string
  path: string
  mandatory: boolean
  description: string
  type: string
  direction: 'source' | 'sink',
  demo?: Demo
}

export interface Demo {
  id: string
  Component: DOMComponent
  source: string
}

interface SourceMetadata extends PropertyMetadata {
  direction: 'source'
}

interface SinkMetadata extends PropertyMetadata {
  direction: 'sink'
}
