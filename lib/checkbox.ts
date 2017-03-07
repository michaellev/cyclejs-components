import { Stream, default as xs } from 'xstream'
import { input, DOMSource } from '@cycle/dom'
import isolate from '@cycle/isolate'
import { VNode } from 'snabbdom/vnode'

interface Sources {
  DOM: DOMSource
  checked?: Stream<boolean>
}

interface Sinks {
  DOM: Stream<VNode>
  checked: Stream<boolean>
}

const Checkbox = (sources: Sources ): Sinks => {
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

export default (sources: Sources) => isolate(Checkbox)(sources)
