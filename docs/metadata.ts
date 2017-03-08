import * as clone from 'clone'
import parsedMetadata from '!!./metadata-loader!'
import demos from './demos'
import { Metadata } from './types'

const metadata: Metadata = clone(parsedMetadata)

Object.values(demos).forEach((demo) => {
  const [componentId, propDirection, propName] = demo.id.split('.')
  metadata[componentId].properties[[propDirection, propName].join('.')].demo = demo
})

export default metadata
