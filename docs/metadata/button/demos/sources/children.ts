import xs from 'xstream'
import { DOMSource, section, label } from '@cycle/dom'
import { DOMComponent } from '../../../../../lib/types'
import TextField from '../../../../../lib/text-field'
import Button from '../../../../../lib/button'

const Demo: DOMComponent = (sources: { DOM: DOMSource }) => {
  const childrenTextField = TextField({
    DOM: sources.DOM,
    value: xs.of("some value")
  })
  const button = Button({
    DOM: sources.DOM,
    children: childrenTextField.value.map((value: string) => value)
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
