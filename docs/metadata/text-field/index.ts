import { ComponentMetadata } from '../../types'
import ValueSourceDemo from './demos/sources/value'
import ValueSinkDemo from './demos/sinks/value'
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
      Demo: ValueSourceDemo,
    },
    {
      name: 'value',
      description: p(['Emits the value of the ', code('value'), ' attribute of the ', code('<input type="text">'), ' element']),
      type: 'sink',
      TSType: 'Stream<string>',
      Demo: ValueSinkDemo,
    },
  ]
} as ComponentMetadata
