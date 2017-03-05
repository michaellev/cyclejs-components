import { makeDOMDriver, } from '@cycle/dom'
import xs from 'xstream'
import { run } from '@cycle/run'
import metadatas from './metadata'
import SPA from './components/spa'

const { description } = require('../package.json')
document.title = description

run(SPA, {
  DOM: makeDOMDriver(document.body),
  metadatas: () => xs.of(metadatas)
})
