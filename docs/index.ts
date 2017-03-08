import { makeDOMDriver, } from '@cycle/dom'
import xs from 'xstream'
import { run } from '@cycle/run'
import metadata from './metadata'
import readmeHtml from '../README.md'
import SPA from './components/spa'

const { description } = require('../package.json')
document.title = description

run(SPA, {
  DOM: makeDOMDriver(document.body),
  metadata: () => xs.of(metadata),
  readmeHtml: () => xs.of(readmeHtml),
})
