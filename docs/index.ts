import { makeDOMDriver } from '@cycle/dom'
import xs, { Stream } from 'xstream'
import { run } from '@cycle/run'
import metadata from './metadata'
import readmeHtml from '../README.md'
import designDecisionsHtml from './design-decisions.md'
import SPA from './components/spa'
import { RawHTMLPage } from './types'

const rawHtmlPages$: Stream<RawHTMLPage[]> = xs.of([
  {
    name: 'Readme',
    html: readmeHtml
  },
  {
    name: 'Design decisions',
    html: designDecisionsHtml
  }
]
)

const { description } = require('../package.json')
document.title = description

run(SPA, {
  DOM: makeDOMDriver(document.body),
  metadata: () => xs.of(metadata),
  rawHtmlPages: () => rawHtmlPages$
})
