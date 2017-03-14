import xs from 'xstream'
import { DOMSource, div } from '@cycle/dom'
import Button from '../../lib/button'
import Checkbox from '../../lib/checkbox'

export default (sources: { DOM: DOMSource }) => {
  const checkedButton = Button({
    DOM: sources.DOM,
    children: xs.of('toggle the checkbox')
  })

  const checked$ = checkedButton.presses.fold((curr: boolean) => !curr, false)

  const checkbox = Checkbox({
    DOM: sources.DOM,
    checked: checked$
  })

  const vnode$ = xs.combine(
    checkedButton.DOM,
    checkbox.DOM
  ).map(([checkedButtonVnode, checkboxVnode]) => (
    div(
      { class: { content: true } },
      [
        checkedButtonVnode,
        ' result: ',
        checkboxVnode
      ]
    )
  ))

  return { DOM: vnode$ }
}
