import { Stream, default as xs } from 'xstream'
import { input, DOMSource } from '@cycle/dom'
import isolate from '@cycle/isolate'
import { DOMComponent } from './types'

interface inputSources {
  DOM: DOMSource,
  checked?: Stream<boolean>
}

const Checkbox: DOMComponent = (sources: inputSources ) => {
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

export default (sources: inputSources) => isolate(Checkbox)(sources)
