import { ComponentDocumentation } from '../types'
import PressesSink from './properties/presses-sink'
import ChildrenSource from './properties/children-source'

const ButtonDoc: ComponentDocumentation = {
  name: 'button',
  id: 'button',
  varName: 'Button',
  properties: [
    {
      name: 'children',
      description: 'children of the button element',
      type: 'source',
      TSType: 'Stream<[VNode]>',
      Documentation: ChildrenSource
    },
    {
      name: 'presses',
      description: 'emitted on button clicks',
      type: 'sink',
      TSType: 'Stream<Symbol>',
      Documentation: PressesSink
    }
  ]
}
export default ButtonDoc
