import { expect, test } from 'claude-code/testing'

const BACKDROP = (scene: string) =>
  ({
    plugin: 'phong-canh',
    component: 'Backdrop',
    requestId: 'backdrop',
    surface: 'desktop',
    props: { scene, plugin: 'phong-canh' },
  }) as const

const SCENES = ['hoang-hon', 'rung-thong', 'synthwave', 'dai-duong', 'cuc-quang', 'bau-troi', 'thanh-pho', 'hoa-anh-dao', 'mua-thu', 'vu-tru']

const engine = (on: any, toasts: string[], looks: string[]) => {
  on('command.register', (_: unknown, e: { name: string }) => ({ value: { command: e.name } }))
  on('store.get', () => ({ value: undefined }))
  on('store.set', () => ({ value: undefined }))
  on('theme.set', (_: unknown, e: { backdrop?: { scene?: string } }) => {
    looks.push(e.backdrop?.scene ?? '')

    return { value: { isDrawn: true } }
  })
  on('ui.toast', (_: unknown, e: { text?: string }) => {
    toasts.push(String(e.text ?? JSON.stringify(e)))

    return { value: undefined }
  })
  on('session.start', (_: unknown, e: { cwd: string }) => ({ cwd: e.cwd }))
  on('clock.now', () => ({ value: 42 }))
  on('clock.after', () => ({ value: { cancel: () => undefined } }))
}

test('every look paints, and the first session starts on the dusk', async ($, on) => {
  const toasts: string[] = []
  const looks: string[] = []

  engine(on, toasts, looks)
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  expect(toasts).toEqual([])
  expect(looks).toEqual(['hoang-hon'])
})

test('each scene draws a Shader over an Svg small enough to send', async ($, on) => {
  engine(on, [], [])

  for (const scene of SCENES) {
    const ui = await $.ui.mount(BACKDROP(scene) as any)
    const svg = await ui.find({ type: 'Svg' } as any)
    const source = String((svg as any)?.props?.source ?? '')

    expect(await ui.find({ type: 'Shader' } as any)).toBeDefined()
    expect(source.startsWith('<svg')).toBe(true)
    expect(source.length < 131072).toBe(true)
    await ui.unmount()
  }
})

test('/giao-dien lists the looks and switches by number', async ($, on) => {
  const looks: string[] = []

  engine(on, [], looks)
  const list = await $.command.run({ command: 'giao-dien', args: '' } as any)

  expect(String(list.text)).toContain('Synthwave')
  const done = await $.command.run({ command: 'giao-dien', args: '<4>' } as any)

  expect(String(done.text)).toContain('Đại dương')
  expect(looks).toEqual(['dai-duong'])
})

test('a commit sets off fireworks on the scene', async ($, on) => {
  engine(on, [], [])
  on('tool.call', () => ({ result: {} }))
  await $.tool.call({ tool: 'Bash', command: 'git commit -m "x"' } as any)

  const ui = await $.ui.mount(BACKDROP('dai-duong') as any)
  const svg = await ui.find({ type: 'Svg' } as any)

  expect(String((svg as any)?.props?.source)).toContain('fw-s')
  await ui.unmount()
})
