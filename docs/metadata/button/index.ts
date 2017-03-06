import { ComponentMetadata } from '../../types'
import PressesSinkDemo from './demos/sinks/presses'
import ChildrenSourceDemo from './demos/sources/children'
import { p, code } from '@cycle/dom'

export default {
  name: 'button',
  id: 'button',
  varName: 'Button',
  properties: [
    {
      name: 'children',
      description: p(['Sets the children of the ', code('button'), ' element']),
      type: 'source',
      TSType: 'Stream<VNode[] | string>',
      Demo: ChildrenSourceDemo,
    },
    {
      name: 'presses',
      description: p('Emitted on clicks'),
      type: 'sink',
      TSType: 'Stream<Symbol>',
      Demo: PressesSinkDemo,
    }
  ]
} as ComponentMetadata
