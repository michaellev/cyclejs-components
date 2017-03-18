import xs from 'xstream'
import { DOMSource, div, button } from '@cycle/dom'
import Clickable from '../../lib/clickable'
import Checkbox from '../../lib/checkbox'

export default (sources: { DOM: DOMSource }) => {
  const {
    click: buttonClick$,
    DOM: buttonVnode$
  } = Clickable({
    DOM: sources.DOM,
    vnode: xs.of(button('toggle the checkbox'))
  })

  const checked$ = buttonClick$.fold((curr: boolean) => !curr, false)

  const {
    DOM: checkboxVnode$
  } = Checkbox({
    DOM: sources.DOM,
    checked: checked$
  })

  const vnode$ = xs.combine(
    buttonVnode$,
    checkboxVnode$
  ).map(([buttonVnode, checkboxVnode]) => (
    div(
      { class: { content: true } },
      [
        buttonVnode,
        ' result: ',
        checkboxVnode
      ]
    )
  ))

  return { DOM: vnode$ }
}
