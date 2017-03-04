import { ComponentMetadata } from '../../types'
import CheckedSinkDemo from './demos/sinks/checked'
import CheckedSourceDemo from './demos/sources/checked'
import { p, code } from '@cycle/dom'

export default {
  name: 'checkbox',
  id: 'checkbox',
  varName: 'Checkbox',
  properties: [
    {
      name: 'checked',
      description: p(['Sets whether the ', code('checked'), ' attribute of the ', code('<input type="checkbox">'), ' element is present']),
      type: 'source',
      TSType: 'Stream<boolean>',
      Demo: CheckedSourceDemo
    },
    {
      name: 'checked',
      description: p('A boolean emitted on toggle'),
      type: 'sink',
      TSType: 'Stream<boolean>',
      Demo: CheckedSinkDemo
    }
  ]
} as ComponentMetadata

