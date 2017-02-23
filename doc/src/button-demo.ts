import xs from 'xstream'
import { DOMSource, section, label, pre, h3, h4 } from '@cycle/dom'
import { DOMComponent } from '../../src/types'
import TextField from '../../src/text-field'
import Button from '../../src/button'

const ButtonDemo: DOMComponent = (sources: { DOM: DOMSource }) => {
  const labelTextField = TextField({
    DOM: sources.DOM,
    value: xs.of('increment')
  })
  const button = Button({
    DOM: sources.DOM,
    children: labelTextField.value.map(value => [value])
  })
  const pressCount$ = button.presses.fold(count => count + 1, 0)
  const vnode$ = xs.combine(
    button.DOM,
    labelTextField.DOM,
    pressCount$
  ).map(([vnode, labelVnode, pressCount]) => (
    section([
      h3('Input properties'),
      h4('label'),
      labelVnode,
      h3('Output properties'),
      h4('presses'),
      label('Example: press count'),
      pre(pressCount.toString()),
      h3('Component'),
      vnode
    ])
  ))
  return { DOM: vnode$ }
}

export default ButtonDemo
