import xs from 'xstream'
import { DOMSource, section, label, pre } from '@cycle/dom'
import { DOMComponent } from '../../../../../src/types'
import Button from '../../../../../src/button'

const Demo: DOMComponent = (sources: { DOM: DOMSource }) => {
  const button = Button({
    DOM: sources.DOM,
    children: xs.of('Increment')
  })

  const pressCount$ = button.presses.fold((curr: number) => curr + 1, 0)

  const vnode$ = xs.combine(
    button.DOM,
    pressCount$
  ).map(([buttonVNode, pressCount]) => (
    section([
      label(`press count:`),
      pre(pressCount.toString()),
      buttonVNode
    ])
  ))

  return { DOM: vnode$ }
}
export default Demo
