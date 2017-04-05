import { div } from '@cycle/dom'
import { DOMSource } from '@cycle/dom'
import { Stream } from 'xstream'

interface Sources {
  DOM: DOMSource
  html: Stream<string>
}

export default ({ DOM, html: html$ }: Sources) => (
  {
    DOM: html$.map(html => div('.content', {key: 'HtmlContent', props: { innerHTML: html }}))
  }
)
