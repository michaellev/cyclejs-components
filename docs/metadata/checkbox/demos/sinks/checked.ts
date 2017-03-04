import xs from 'xstream'
import { DOMSource, section, label, code, br } from '@cycle/dom'
import { DOMComponent } from '../../../../../lib/types'
import Checkbox from '../../../../../lib/checkbox'

const Demo: DOMComponent = (sources: { DOM: DOMSource }) => {
  const checkbox = Checkbox({
    DOM: sources.DOM
  })

  const vnode$ = xs.combine(
    checkbox.DOM,
    checkbox.checked
  ).map(([checkboxVnode, checkboxChecked]) => (
    section([
      label('toggle me:'),
      checkboxVnode,
      br(),
      label(`checked:`),
      code(String(checkboxChecked)),
    ])
  ))

  return { DOM: vnode$ }
}
export default Demo

