import { default as xs, Stream } from 'xstream'
import { input, DOMSource } from '@cycle/dom'
import isolate from '@cycle/isolate'
import { VNode } from 'snabbdom/vnode'

interface Sources {
  DOM: DOMSource,
  value?: Stream<string>
}

interface Sinks {
  DOM: Stream<VNode>
  value: Stream<string>
}

const TextField = (sources: Sources ): Sinks => {
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

export default (sources: Sources) => isolate(TextField)(sources)
