import xs from 'xstream'
import { DOMSource, div, code } from '@cycle/dom'
import { Checkbox } from '../../lib'

export default (sources: { DOM: DOMSource }) => {
  const checkbox = Checkbox({
    DOM: sources.DOM
  })

  const vnode$ = xs.combine(
    checkbox.DOM,
    checkbox.checked
  ).map(([checkboxVnode, checkboxChecked]) => (
    div(
      { class: { content: true } },
      [
        'toggle me: ',
        checkboxVnode,
        ' checked: ',
        code(String(checkboxChecked)),
      ]
    )
  ))

  return { DOM: vnode$ }
}
