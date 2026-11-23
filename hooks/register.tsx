import type { EngineInterface, Hook, Register } from 'claude-code'

import { DEFAULT_LOOK, findLook, LOOKS } from './themes'

const STORE_KEY = 'look'

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

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const chosen = LOOKS.find(one => one.id === e.props.scene)

    if (chosen === undefined) {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={chosen.scene} alt={chosen.alt} />
  })
}
