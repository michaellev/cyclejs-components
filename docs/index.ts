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

const rawHtmlPages$: Stream<RawHTMLPage[]> = xs.of([
  {
    name: 'Readme',
    path: '/',
    html: readmeHtml
  },
  {
    name: 'Design decisions',
    path: '/design-decisions',
    html: designDecisionsHtml
  },
  {
    name: 'Contributing',
    path: '/contributing',
    html: contributingHtml
  }
]
)

const { title } = require('../package.json')
document.title = title

run(SPA, {
  DOM: makeDOMDriver(document.body),
  history: makeHistoryDriver(createHistory()),
  metadata: () => xs.of(metadata),
  rawHtmlPages: () => rawHtmlPages$
})
