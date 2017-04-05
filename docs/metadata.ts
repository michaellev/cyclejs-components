import * as clone from 'clone'
import parsedMetadata from '!!./metadata-loader!'
import demos from './demos-loader!'
import { Metadata } from './interfaces'

const metadata: Metadata = clone(parsedMetadata)

Object.entries(demos).forEach(([id, Component]) => {
  metadata.components[id].DemoComponent = Component
})

export default metadata
