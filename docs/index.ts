import { makeDOMDriver } from '@cycle/dom'
import xs, { Stream } from 'xstream'
import { run } from '@cycle/run'
import metadata from './metadata'
import readmeHtml from '../README.md'
import contributingHtml from './contributing.md'
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
  },
  {
    name: 'Contributing',
    html: contributingHtml
  }
]
)

const { title } = require('../package.json')
document.title = title

run(SPA, {
  DOM: makeDOMDriver(document.body),
  metadata: () => xs.of(metadata),
  rawHtmlPages: () => rawHtmlPages$
})
