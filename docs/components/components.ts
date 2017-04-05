import { DOMSource, div, label, aside, ul, li, a } from '@cycle/dom'
import Component from './component'
import { Stream, default as xs } from 'xstream'
import { Metadata, ComponentMetadata } from '../interfaces'
import isolate from '@cycle/isolate'

interface Sources {
  DOM: DOMSource
  metadata: Stream<Metadata>
}

const Components = ({ DOM, metadata: metadata$ }: Sources) => {
  const menuClicks$ = DOM.select('.menu a').events('click')
  const componentId$ = menuClicks$.map(menuClick => (
    (menuClick.target as HTMLAnchorElement).dataset.id as string | null)
  ).startWith(null)
  const component$ = xs.combine(
    componentId$,
    metadata$
  ).map(([
    componentId,
    metadata
  ]) => componentId ? metadata.components[componentId] : null)

  const componentVnode$ = component$
    .map((component) => {
      if (component === null) {
        return xs.of( div('.notification', 'Select a component.') )
      }
      return Component({ DOM, component: xs.of(component) }).DOM
    })
    .flatten()

  const vnode$ = xs.combine(
    componentId$,
    metadata$,
    componentVnode$
  ).map(([
    componentId,
    metadata,
    componentVnode
  ]) => {
    const components: ComponentMetadata[] = Object.values(metadata.components)
    return div('.columns', { key: 'components' },
      [
        aside('.column.is-2-desktop.menu',
          [
            label('.menu-label', 'Components'),
            ul('.menu-list',
              [
                ...(components.map((component) => li(a('.name',
                  {
                    class: { 'is-active': component.id === componentId },
                    dataset: { id: component.id }
                  },
                  component.id
                ))))
              ]
            )
          ]
        ),
        div('.column.is-10', componentVnode)
      ]
    )
  })
  return {
    DOM: vnode$
  }
}

export default (sources: Sources) => isolate(Components)(sources)
