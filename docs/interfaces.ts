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
  }
  sources: {
    [id: string]: SourceMetadata
  }
  sinks: {
    [id: string]: SinkMetadata
  }
  DemoComponent: DemoComponent
}

export interface SourceSinkMetadata {
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

interface SourceMetadata extends SourceSinkMetadata {
  direction: 'source'
}

interface SinkMetadata extends SourceSinkMetadata {
  direction: 'sink'
}

export interface RawHTMLPage {
  name: string
  path: string
  html: string
}
