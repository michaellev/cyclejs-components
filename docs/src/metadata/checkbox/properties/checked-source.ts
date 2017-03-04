import xs from 'xstream'
import { DOMSource, section, label, br } from '@cycle/dom'
import { DOMComponent } from '../../../../../src/types'
import Checkbox from '../../../../../src/checkbox'
import Button from '../../../../../src/button'

const Demo: DOMComponent = (sources: { DOM: DOMSource }) => {
  const checkedButton = Button({
    DOM: sources.DOM,
    children: xs.of('toggle')
  })

  const checked$ = checkedButton.presses.fold((curr: boolean) => !curr, false)

  const checkbox = Checkbox({
    DOM: sources.DOM,
    checked: checked$
  })

  const vnode$ = xs.combine(
    checkedButton.DOM,
    checkbox.DOM,
  ).map(([checkedButtonVnode, checkboxVnode]) => (
    section([
      checkedButtonVnode,
      br(),
      label('result:'),
      checkboxVnode,
    ])
  ))

  return { DOM: vnode$ }
}
export default Demo


