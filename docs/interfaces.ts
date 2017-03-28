import { DOMSource } from '@cycle/dom'
import { HTTPSource, RequestOptions } from '@cycle/http'
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
    title: string
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
  descriptionHtml: string
  type: string
  direction: 'source' | 'sink'
}

interface DemoComponentSources {
  DOM: DOMSource
  HTTP?: HTTPSource
}

export interface DemoComponentSinks {
  DOM: Stream<VNode>
  HTTP?: Stream<RequestOptions>
}

export interface DemoComponent {
  (sources: DemoComponentSources): DemoComponentSinks
}

export interface Demo {
  path: string
  id: string
  Component: DemoComponent
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
