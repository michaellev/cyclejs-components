import xs from 'xstream'
import { DOMSource, div, code } from '@cycle/dom'
import { Button } from '../../lib'

export default (sources: { DOM: DOMSource }) => {
  const button = Button({
    DOM: sources.DOM,
    children: xs.of('Increment the counter:')
  })

  const pressCount$ = button.presses.fold((curr: number) => curr + 1, 0)

  const vnode$ = xs.combine(
    button.DOM,
    pressCount$
  ).map(([buttonVNode, pressCount]) => (
    div(
      { class: { content: true } },
      [
        buttonVNode,
        ' ',
        code(pressCount.toString())
      ]
    )
  ))

  return { DOM: vnode$ }
}
