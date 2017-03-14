import * as clone from 'clone'
import parsedMetadata from '!!./metadata-loader!'
import demos from './demos-loader!'
import { Metadata, Demo } from './types'

const metadata: Metadata = clone(parsedMetadata)

demos.forEach((demo: Demo) => {
  const [componentId, propDirection, propName] = demo.id.split('.')
  metadata[componentId].properties[[propDirection, propName].join('.')].demo = demo
})

export default metadata
