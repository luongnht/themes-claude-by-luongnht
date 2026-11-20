import { atom, read, update } from 'claude-code'
import type { EngineInterface, Hook, Register } from 'claude-code'

import type { Burst } from '../types'
import { burstMs, fireworks } from './fireworks'
import { DEFAULT_LOOK, findLook, LOOKS } from './themes'

const STORE_KEY = 'look'
const burstAtom = atom({ plugin: 'phong-canh', key: 'burst' } as const, null, { shape: 'burst-1' })

const MERGE = /\b(gh\s+pr\s+merge|git\s+merge|git\s+push)\b/
const COMMIT = /\bgit\s+commit\b/
const LONG_TURN_MS = 60_000

const listing = (current: string) =>
  LOOKS.map((one, i) => `${i + 1}. ${one.id === current ? '▸ ' : ''}${one.name} (${one.id}): ${one.hint}`).join('\n')

const apply = async ($: EngineInterface, id: string) => {
  const chosen = findLook(id) ?? findLook(DEFAULT_LOOK)

  if (chosen === undefined) {
    return
  }
  const set = await $.theme.set(chosen.args)

  if (!set.isDrawn) {
    $.ui.status(set.reason)
  }
}

const launch = async ($: EngineInterface, kind: Burst['kind'], x = 0.5, y = 0.3) => {
  const id = await $.clock.now()
  const burst: Burst = { id, kind, x, y }

  await update($, burstAtom, () => burst)
  $.clock.after(burstMs(burst), async () => {
    await update($, burstAtom, held => (held?.id === id ? null : held))
  })
}

const switchLook: Hook<'command.run'> = async ($, e) => {
  const saved = await $.store.get(STORE_KEY)
  const current = typeof saved === 'string' ? saved : DEFAULT_LOOK

  if (e.args.trim() === '') {
    return { text: `Các cảnh nền. Gõ số hoặc tên, ví dụ: /giao-dien 4\n${listing(current)}` }
  }
  const chosen = findLook(e.args)

  if (chosen === undefined) {
    return { text: `Không có cảnh "${e.args.trim()}". Gõ số hoặc tên, ví dụ: /giao-dien 4\n${listing(current)}` }
  }
  await $.store.set(STORE_KEY, chosen.id)
  await apply($, chosen.id)

  return { text: `Đã đổi sang ${chosen.name}.` }
}
export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    // While building: name any look Desktop would refuse to paint.
    for (const one of LOOKS) {
      const unpainted = one.problems.find(line => line.startsWith("Desktop won't paint"))

      if (unpainted !== undefined) {
        $.ui.toast(`${one.name}: ${unpainted}`)
      }
    }
    for (const name of ['giao-dien']) {
      await $.command.register({
        name,
        description: 'Đổi cảnh nền, ví dụ /giao-dien 4. Để trống để xem danh sách',
        argumentHint: '[số hoặc tên]',
        immediate: true,
      })
    }
    const saved = await $.store.get(STORE_KEY)

    await apply($, typeof saved === 'string' ? saved : DEFAULT_LOOK)

    return next(e)
  })

  on('command.run', { command: 'giao-dien' }, switchLook)

  // Commits and merges set off fireworks once they have run cleanly.
  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    const ran = await next(e)

    if (ran.deny === undefined && ran.isError !== true) {
      const kind = MERGE.test(e.command) ? 'merge' : COMMIT.test(e.command) ? 'commit' : undefined

      // Fireworks never stand in the way of the tool's own result.
      if (kind !== undefined) {
        await launch($, kind).catch(() => undefined)
      }
    }

    return ran
  })

  // A long piece of work, finished: a single burst.
  on('turn.complete', async ($, e, next) => {
    if (e.agentId === undefined && e.reason === 'answer' && e.durationMs >= LONG_TURN_MS) {
      await launch($, 'small')
    }

    return next(e)
  })

  // A click on the bare backdrop sets one off where it landed.
  on('ui.pointer', async ($, e, next) => {
    await launch($, 'click', e.x, e.y)

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const chosen = LOOKS.find(one => one.id === e.props.scene)

    if (chosen === undefined) {
      return next(e)
    }
    const { Shader, Svg } = $.ui.resolve(e)
    const burst = await read($, burstAtom)
    const source = burst === null ? chosen.scene : chosen.scene.replace(/<\/svg>$/, `${fireworks(burst)}</svg>`)

    return (
      <Shader module="./ripple.ts" values={chosen.tint}>
        <Svg source={source} alt={chosen.alt} isInteractive />
      </Shader>
    )
  })
}
