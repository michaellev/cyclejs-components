import xs from 'xstream'
import { DOMSource, div } from '@cycle/dom'
import TextField from '../../lib/text-field'
import Button from '../../lib/button'

export default (sources: { DOM: DOMSource }) => {
  const childrenTextField = TextField({
    DOM: sources.DOM,
    value: xs.of('some value')
  })
  const button = Button({
    DOM: sources.DOM,
    children: childrenTextField.value.map((value: string) => value)
  })
  const vnode$ = xs.combine(
    button.DOM,
    childrenTextField.DOM
  ).map(([buttonVNode, childrenTextFieldVNode]) => (
    div(
      { class: { content: true } },
      [
        'set the children (single text node, in this case): ',
        childrenTextFieldVNode,
        ' result: ',
        buttonVNode
      ]
    )
  ))
  return { DOM: vnode$ }
}
