import { expect, test } from 'claude-code/testing'

import { LOOKS } from '../hooks/themes'

test('Desktop paints every look', async () => {
  const refused = LOOKS.flatMap(one => one.problems.filter(line => line.startsWith("Desktop won't paint")).map(line => `${one.id}: ${line}`))

  expect(refused).toEqual([])
  expect(LOOKS.map(one => one.scene.length).every(len => len < 131072)).toBe(true)
})
