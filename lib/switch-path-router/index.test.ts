import { test } from 'ava'
import SwitchPathRouter from '.'
import { mockTimeSource } from '@cycle/time'

test.cb((t) => {
  const Time = mockTimeSource()

  const sourcePath$ = Time.diagram(
    '-a--',
    { a: '/a' }
  )

  const routes$ = Time.diagram(
    'a--b',
    { a: { '/a': 'a' }, b: { '/a': 'b' } }
  )

  const expectedSinkPath$ = Time.diagram(
    '-a-a',
    { a: '/a' }
  )

  const expectedValue$ = Time.diagram(
    '-a-b'
  )

  const {
    path: actualSinkPath$,
    value: actualValue$
  } = SwitchPathRouter({
    path: sourcePath$,
    routes: routes$
  })

  Time.assertEqual(expectedSinkPath$, actualSinkPath$)
  Time.assertEqual(expectedValue$, actualValue$)

  Time.run(t.end)
})
