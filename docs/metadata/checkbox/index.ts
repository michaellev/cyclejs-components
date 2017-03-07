import { ComponentMetadata } from '../../types'
import CheckedSinkDemo from './demos/sinks/checked'
import checkedSinkDemoSource from '!!raw-loader!./demos/sinks/checked'
import CheckedSourceDemo from './demos/sources/checked'
import checkedSourceDemoSource from '!!raw-loader!./demos/sources/checked'
import { p, code } from '@cycle/dom'

export default {
  name: 'checkbox',
  id: 'checkbox',
  varName: 'Checkbox',
  properties: [
    {
      name: 'checked',
      description: p(['Sets whether the ', code('checked'), ' attribute of the ', code('<input type="checkbox">'), ' element is present']),
      direction: 'source',
      type: 'Stream<boolean>',
      demo: {
        Component: CheckedSourceDemo,
        source: checkedSourceDemoSource
      },
    },
    {
      name: 'checked',
      description: p('A boolean emitted on toggle'),
      direction: 'sink',
      type: 'Stream<boolean>',
      demo: {
        Component: CheckedSinkDemo,
        source: checkedSinkDemoSource
      },
    }
  ]
} as ComponentMetadata

