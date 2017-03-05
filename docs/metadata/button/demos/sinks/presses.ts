import xs from 'xstream'
import { DOMSource, section, label, code, br } from '@cycle/dom'
import { DOMComponent } from '../../../../../lib/types'
import Button from '../../../../../lib/button'

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
      buttonVNode,
      br(),
      label(`press count: `),
      code(pressCount.toString())
    ])
  ))

  return { DOM: vnode$ }
}
export default Demo
