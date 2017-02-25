import { ComponentDocumentation } from '../types'
// import PressesSink from './properties/presses'
import ChildrenSource from './properties/children'

const ButtonDoc: ComponentDocumentation = {
  name: 'button',
  id: 'button',
  varName: 'Button',
  properties: [
    {
      name: 'children',
      description: 'children of the button element',
      type: 'source',
      TSType: '[VNode]',
      Documentation: ChildrenSource
    },
    // {
      // name: 'presses',
      // type: 'sink',
      // description: '',
      // Documentation: PressesSink
    // }
  ]
}
export default ButtonDoc
