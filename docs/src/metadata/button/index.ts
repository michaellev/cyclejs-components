import { ComponentMetadata } from '../../types'
import PressesSink from './properties/presses-sink'
import ChildrenSource from './properties/children-source'

export default {
  name: 'button',
  id: 'button',
  varName: 'Button',
  properties: [
    {
      name: 'children',
      description: 'children of the button element',
      type: 'source',
      TSType: 'Stream<VNode[] | string>',
      Demo: ChildrenSource
    },
    {
      name: 'presses',
      description: 'emitted on button clicks',
      type: 'sink',
      TSType: 'Stream<Symbol>',
      Demo: PressesSink
    }
  ]
} as ComponentMetadata
