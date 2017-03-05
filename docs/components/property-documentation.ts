import { DOMSource, dl, dt, dd, code } from '@cycle/dom'
import { Stream, default as xs } from 'xstream'
import{ PropertyMetadata } from '../types'

interface Sources {
  DOM: DOMSource,
  propertyMetadata: Stream<PropertyMetadata>
}

export default ({ DOM, propertyMetadata: metadata$ }: Sources) => {
  const rMetadata$ = metadata$.remember()
  const demoVnode$ = rMetadata$.map((metadata) => (
    metadata.Demo ? metadata.Demo({ DOM }).DOM : xs.of(undefined)
  )).flatten()

  const vnode$ = xs.combine(
    rMetadata$,
    demoVnode$,
  ).map(([
    metadata,
    demoVnode
  ]) => (
    dl([
      dt('name'),
      dd(code(metadata.name)),
      dt('description'),
      dd(metadata.description),
      dt('direction'),
      dd(
        { class: { tag: true } },
        metadata.type
      ),
      dt('type'),
      dd(code(metadata.TSType)),
      ...(demoVnode ? [dt('demo'), dd(demoVnode)] : [])
    ])
  ))

  return {
    DOM: vnode$
 }
}
