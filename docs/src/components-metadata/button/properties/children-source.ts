import xs from 'xstream'
import { DOMSource, section, label } from '@cycle/dom'
import { DOMComponent } from '../../../../../src/types'
import TextField from '../../../../../src/text-field'
import Button from '../../../../../src/button'

const Demo: DOMComponent = (sources: { DOM: DOMSource }) => {
  const childrenTextField = TextField({
    DOM: sources.DOM,
    value: xs.of("['banana']")
  })
  const button = Button({
    DOM: sources.DOM,
    children: childrenTextField.value.map(value => eval(value))
  })
  const vnode$ = xs.combine(
    button.DOM,
    childrenTextField.DOM
  ).map(([buttonVNode, childrenTextFieldVNode]) => (
    section([
      label('input:'),
      childrenTextFieldVNode,
      label('result:'),
      buttonVNode
    ])
  ))
  return { DOM: vnode$ }
}
export default Demo
