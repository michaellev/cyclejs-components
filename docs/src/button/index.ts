import { ComponentDocumentation } from '../types'
// import PressesSink from './sinks/presses'
import LabelSource from './sources/children'

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
      Documentation: LabelSource
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
