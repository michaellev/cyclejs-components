import { div, section } from '@cycle/dom'
import { virtualizeString } from 'snabbdom-virtualize'
import { DOMSource } from '@cycle/dom'
import { Stream } from 'xstream'

interface Sources {
  DOM: DOMSource
  html: Stream<string>
}

export default ({ DOM, html: html$ }: Sources) => (
  {
    DOM: html$.map(html => (
      section(
        { class: { section: 'true', columns: true, 'is-centered': true } },
        div(
          {
            props: { id: '' },
            class: { column: true, content: true, 'is-8-desktop': true, 'is-outlined': true }
          },
          virtualizeString(html)
        )
      )
    ))
  }
)
