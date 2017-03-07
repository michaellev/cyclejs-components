import { ComponentMetadata } from '../../types'
import PressesSinkDemo from './demos/sinks/presses'
import pressesSinkDemoSource from '!!raw-loader!./demos/sinks/presses.ts'
import ChildrenSourceDemo from './demos/sources/children'
import childrenSourceDemoSource from '!!raw-loader!./demos/sources/children.ts'
import { p, code } from '@cycle/dom'

export default {
  name: 'button',
  id: 'button',
  varName: 'Button',
  properties: [
    {
      name: 'children',
      description: p(['Sets the children of the ', code('button'), ' element']),
      direction: 'source',
      type: 'Stream<VNode[] | string>',
      demo: {
        Component: ChildrenSourceDemo,
        source: childrenSourceDemoSource
      },
    },
    {
      name: 'presses',
      description: p('Emitted on clicks'),
      direction: 'sink',
      type: 'Stream<Symbol>',
      demo: {
        Component: PressesSinkDemo,
        source: pressesSinkDemoSource
      },
    }
  ]
} as ComponentMetadata
