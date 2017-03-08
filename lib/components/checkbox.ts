import { Stream, default as xs } from 'xstream'
import isolate from '@cycle/isolate'
import { input, DOMSource } from '@cycle/dom'
import { VNode } from 'snabbdom/vnode'

export interface Sources {
  DOM: DOMSource
  /**
   * Sets whether it is checked.
   */
  checked?: Stream<boolean>
}

export interface Sinks {
  DOM: Stream<VNode>
  /**
   * Emits whether it is checked, on changes.
   */
  checked: Stream<boolean>
}

export const Checkbox = (sources: Sources ): Sinks => {
  const checkedSource$ = sources.checked || xs.of(false)

  const domChecked$ = sources.DOM
    .select('input')
    .events('change')
    .map(event => (<HTMLInputElement>event.target).checked)

  const checked$ = xs.merge(
    checkedSource$,
    domChecked$
  ).remember()

  const vnode$ = checked$.map((checked) => input({ attrs: { type: 'checkbox', checked: checked } }))

  return {
    DOM: vnode$,
    checked: checked$
  }
}

export default (sources: Sources): Sinks => isolate(Checkbox)(sources)
