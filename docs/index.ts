import { makeDOMDriver } from '@cycle/dom'
import { makeHistoryDriver } from '@cycle/history'
import createHistory from 'history/createBrowserHistory'
import xs, { Stream } from 'xstream'
import { run } from '@cycle/run'
import metadata from './metadata'
import readmeHtml from '../README.md'
import contributingHtml from './contributing.md'
import designDecisionsHtml from './design-decisions.md'
import SPA from './components/spa'
import { RawHTMLPage } from './interfaces'

const basename = '/' + metadata.pkg.repository.url
  .split('/')
  .slice(-1)[0]
  .slice(0, -4)

const rawHtmlPages$: Stream<RawHTMLPage[]> = xs.of([
  {
    name: 'Readme',
    id: 'index',
    html: readmeHtml
  },
  {
    name: 'Design decisions',
    id: 'design-decisions',
    html: designDecisionsHtml
  },
  {
    name: 'Contributing',
    id: 'contributing',
    html: contributingHtml
  }
]
)

const { title } = require('../package.json')
document.title = title

run(SPA, {
  DOM: makeDOMDriver(document.body),
  history: makeHistoryDriver(createHistory({ basename })),
  metadata: () => xs.of(metadata),
  rawHtmlPages: () => rawHtmlPages$
})
