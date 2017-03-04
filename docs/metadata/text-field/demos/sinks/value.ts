import xs from 'xstream'
import { DOMSource, section, label, br, code } from '@cycle/dom'
import { DOMComponent } from '../../../../../lib/types'
import TextField from '../../../../../lib/text-field'

const Demo: DOMComponent = (sources: { DOM: DOMSource} ) => {
  const textField = TextField({
    DOM: sources.DOM,
    value: xs.of('some value')
  })

  const vnode$ = xs.combine(
    textField.DOM,
    textField.value
  ).map(([textFieldVNode, textFieldValue]) =>(
    section([
      label('Type something in:'),
      textFieldVNode,
      br(),
      label('result:'),
      code(textFieldValue)
      ])
  ))

  return { DOM: vnode$ }
}
export default Demo
