import xs from 'xstream'
import { DOMSource, section, label, br } from '@cycle/dom'
import { DOMComponent } from '../../../../../src/types'
import TextField from '../../../../../src/text-field'

const Demo: DOMComponent = (sources: { DOM: DOMSource} ) => {
  const valueTextField = TextField({
    DOM: sources.DOM,
    value: xs.of('some value')
  })
  
  const textField = TextField({
    DOM: sources.DOM,
    value: valueTextField.value
  })

  const vnode$ = xs.combine(
    textField.DOM,
    valueTextField.DOM
  ).map(([textFieldVNode, valueTextFieldVNode]) =>(
    section([
      label('Set the value:'),
      valueTextFieldVNode,
      br(),
      label('result:'),
      textFieldVNode
      ])
  ))

  return { DOM: vnode$ }
}
export default Demo
