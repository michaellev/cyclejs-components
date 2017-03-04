import { ComponentMetadata } from '../../types'
import valueSource from './properties/value-source'
import valueSink from './properties/value-sink'

export default {
  name: 'text field',
  id: 'text-field',
  varName: 'TextField',
  properties: [
    {
      name: 'value',
      description: 'sets the value of the input DOM element attribute',
      type: 'source',
      TSType: 'Stream<string>',
      Demo: valueSource
    },
    {
      name: 'value',
      description: 'value of the input DOM element property',
      type: 'sink',
      TSType: 'Stream<string>',
      Demo: valueSink
    },
  ]
} as ComponentMetadata
