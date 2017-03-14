import { Demo } from '../types'
import ButtonSourceChildren from './button.source.children'
import buttonSourceChildrenSource from '!!raw-loader!./button.source.children'
import ButtonSinkPresses from './button.sink.presses'
import buttonSinkPressesSource from '!!raw-loader!./button.sink.presses'
import CheckboxSourceChecked from './checkbox.source.checked'
import checkboxSourceCheckedSource from '!!raw-loader!./checkbox.source.checked'
import CheckboxSinkChecked from './checkbox.sink.checked'
import checkboxSinkCheckedSource from '!!raw-loader!./checkbox.sink.checked'
import TextFieldSourceValue from './text-field.source.value'
import textFieldSourceValueSource from '!!raw-loader!./text-field.source.value'
import TextFieldSinkValue from './text-field.sink.value'
import textFieldSinkValueSource from '!!raw-loader!./text-field.sink.value'
import ClickableSinkClick from './clickable.sink.click'
import clickableSinkClickSource from '!!raw-loader!./clickable.sink.click'

const demos: Demo[] = [
  {
    id: 'button.source.children',
    Component: ButtonSourceChildren,
    source: buttonSourceChildrenSource
  },
  {
    id: 'button.sink.presses',
    Component: ButtonSinkPresses,
    source: buttonSinkPressesSource
  },
  {
    id: 'checkbox.source.checked',
    Component: CheckboxSourceChecked,
    source: checkboxSourceCheckedSource
  },
  {
    id: 'checkbox.sink.checked',
    Component: CheckboxSinkChecked,
    source: checkboxSinkCheckedSource
  },
  {
    id: 'text-field.source.value',
    Component: TextFieldSourceValue,
    source: textFieldSourceValueSource
  },
  {
    id: 'text-field.sink.value',
    Component: TextFieldSinkValue,
    source: textFieldSinkValueSource
  },
  {
    id: 'clickable.sink.click',
    Component: ClickableSinkClick,
    source: clickableSinkClickSource
  }
]

export default demos
