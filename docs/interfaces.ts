import { DOMSource } from '@cycle/dom'
import { Stream } from 'xstream'
import { VNode } from 'snabbdom/vnode'

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

interface DOMComponent {
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

export interface RawHTMLPage {
  name: string
  html: string
}
