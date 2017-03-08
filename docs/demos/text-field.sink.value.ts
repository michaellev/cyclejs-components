import xs from 'xstream'
import { DOMSource, div, code } from '@cycle/dom'
import { TextField } from '../../lib'

export default (sources: { DOM: DOMSource} ) => {
  const textField = TextField({
    DOM: sources.DOM,
    value: xs.of('some value')
  })

  const vnode$ = xs.combine(
    textField.DOM,
    textField.value
  ).map(([textFieldVNode, textFieldValue]) =>(
    div(
      { class: { content: true } },
      [
        'Type something in: ',
        textFieldVNode,
        ' result: ',
        code(textFieldValue)
      ]
    )
  ))

  return { DOM: vnode$ }
}
