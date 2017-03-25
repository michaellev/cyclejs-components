import { DOMSource } from '@cycle/dom'
import { Stream } from 'xstream'
import { VNode } from 'snabbdom/vnode'

export interface Metadata {
  pkg: {
    title: string
    tagLine: string
    homepage: string
    repository: {
      homepage: string
    }
  }
  components: {
    [id: string]: ComponentMetadata
  }
}

export interface ComponentMetadata {
  id: string
  varName: string
  directory: string
  pkg: {
    name: string
  }
  properties: {
    [id: string]: SourceMetadata | SinkMetadata
  }
  demo: Demo
}

export interface PropertyMetadata {
  id: string
  name: string
  parentId: string
  path: string
  optional: boolean
  description: string
  type: string
  direction: 'source' | 'sink'
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
  path: string
  id: string
  Component: DOMComponent
  sourceHtml: string
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
