import * as clone from 'clone'
import parsedMetadata from '!!./metadata-loader!'
import demos from './demos-loader!'
import { Metadata, Demo } from './interfaces'

const metadata: Metadata = clone(parsedMetadata)

demos.forEach((demo: Demo) => {
  metadata.components[demo.id].demo = demo
})

export default metadata
