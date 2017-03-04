import { ComponentMetadata } from '../../types'
import CheckedSinkDemo from './properties/checked-sink'
import CheckedSourceDemo from './properties/checked-source'

export default {
  name: 'checkbox',
  id: 'checkbox',
  varName: 'Checkbox',
  properties: [
    {
      name: 'checked',
      description: 'sets whether is checked',
      type: 'source',
      TSType: 'Stream<boolean>',
      Demo: CheckedSourceDemo
    },
    {
      name: 'checked',
      description: 'emitted on toggle',
      type: 'sink',
      TSType: 'Stream<boolean>',
      Demo: CheckedSinkDemo
    }
  ]
} as ComponentMetadata

