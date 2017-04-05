import isolate from '@cycle/isolate'
import xs, { Stream } from 'xstream'
import switchPath from 'switch-path'
import { RouteDefinitions } from 'switch-path/lib/es2015/types'
export { RouteDefinitions } from 'switch-path/lib/es2015/types'

export interface Sources {
  /**
   * The path. Usually from the `pathname` property of the value emitted by [the history driver](https://cycle.js.org/api/history.html).
   */
  path: Stream<string>
  /**
   * `RouteDefinitions` is the second argument to [`switch-path`](https://www.npmjs.com/package/switch-path).
   *
   * Tip: the `value` property could be a Cycle.js component.
   */
  routes: Stream<RouteDefinitions>
}

export interface Sinks {
  /**
   * The `path` property of what [`switch-path`](https://www.npmjs.com/package/switch-path) returns.
   *
   * Tip: in many cases you wouldn't use this.
   */
  path: Stream<string>
  /**
   * The `value` property of what [`switch-path`](https://www.npmjs.com/package/switch-path) returns.
   *
   * Tip: you could consider this your `currentPage$`.
   */
  value: Stream<any>
}

const SwitchPathRouter = ({
  path: path$,
  routes: routes$
}: Sources): Sinks => {
  const match$ = xs
    .combine(path$, routes$)
    .map(([path, routes]) => switchPath(path, routes))
    .remember()

  const matchPath$ = match$
    .filter(({ path }) => path !== null)
    .map(({ path }) => path as string)

  const matchValue$ = match$
    .map(({ value }) => value)

  return { path: matchPath$, value: matchValue$ }
}

export default (sources: Sources): Sinks => isolate(SwitchPathRouter)(sources)
