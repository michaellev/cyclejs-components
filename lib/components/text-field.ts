import { default as xs, Stream } from 'xstream'
import isolate from '@cycle/isolate'
import { input, DOMSource } from '@cycle/dom'
import { VNode } from 'snabbdom/vnode'

export interface Sources {
  DOM: DOMSource,
  /**
   * Sets the text content.
   */
  value?: Stream<string>
}

export interface Sinks {
  DOM: Stream<VNode>
  /**
   * Emits the text content on changes.
   */
  value: Stream<string>
}

export const TextField = (sources: Sources ): Sinks => {
  const domValue$ = sources.DOM
    .select('input')
    .events('input')
    .map(event => (<HTMLInputElement>event.target).value)

  const inputValue$ = sources.value || xs.of('')
  const value$ = xs.merge(domValue$, inputValue$.endWhen(domValue$))
    .remember()

  const vnode$ = value$.map(value => input({ value, attrs: { type: 'text', value } }))

  const sinks = {
    DOM: vnode$,
    value: value$
  }

  return sinks
}

export default (sources: Sources): Sinks => isolate(TextField)(sources)
