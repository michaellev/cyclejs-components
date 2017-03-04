import { ComponentMetadata } from '../../types'
import valueSource from './properties/value-source'
import valueSink from './properties/value-sink'
import { p, code } from '@cycle/dom'

export default {
  name: 'text field',
  id: 'text-field',
  varName: 'TextField',
  properties: [
    {
      name: 'value',
      description: p(['Sets the value of the ', code('value'), ' attribute of the ', code('<input type="text">'), ' element']),
      type: 'source',
      TSType: 'Stream<string>',
      Demo: valueSource
    },
    {
      name: 'value',
      description: p(['Emits the value of the ', code('value'), ' attribute of the ', code('<input type="text">'), ' element']),
      type: 'sink',
      TSType: 'Stream<string>',
      Demo: valueSink
    },
  ]
} as ComponentMetadata
