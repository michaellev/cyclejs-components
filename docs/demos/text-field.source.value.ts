import xs from 'xstream'
import { DOMSource, div } from '@cycle/dom'
import { TextField } from '../../lib'

export default (sources: { DOM: DOMSource} ) => {
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
  ).map(([textFieldVNode, valueTextFieldVNode]) => (
    div(
      { class: { content: true } },
      [
        'Set the value: ',
        valueTextFieldVNode,
        ' result: ',
        textFieldVNode
      ]
    )
  ))

  return { DOM: vnode$ }
}
