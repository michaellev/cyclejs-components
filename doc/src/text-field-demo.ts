import xs from 'xstream'
import { DOMSource, section, label, pre, h3, h4 } from '@cycle/dom'
import { DOMComponent } from '../../src/types'
import TextField from '../../src/text-field'

const TextFieldDemo: DOMComponent = (sources: { DOM: DOMSource }) => {
  const inputTextField = TextField({ DOM: sources.DOM })
  const textField = TextField({ DOM: sources.DOM, value: inputTextField.value })
  const vnode$ = xs.combine(
    textField.DOM,
    textField.value,
    inputTextField.DOM
  ).map(([vnode, value, inputVnode]) => (
    section([
      h3('Input properties'),
      h4('value'),
      inputVnode,
      h3('Output properties'),
      h4('value'),
      pre(value),
      h3('Component'),
      vnode
    ])
  ))
  return { DOM: vnode$ }
}

export default TextFieldDemo
