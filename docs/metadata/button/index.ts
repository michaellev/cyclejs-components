import { ComponentMetadata } from '../../types'
import PressesSink from './properties/presses-sink'
import ChildrenSource from './properties/children-source'
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
      Demo: ChildrenSource
    },
    {
      name: 'presses',
      description: p('Emitted on clicks'),
      type: 'sink',
      TSType: 'Stream<Symbol>',
      Demo: PressesSink
    }
  ]
} as ComponentMetadata
