// A halftone glow that follows the pointer: where it passes, a trail of dots
// swells and fades, in the scene's own light color.
import { buffer, dt, exp, floor, length, max, min, picture, pointers, shader, size, smoothstep, values, vec4 } from 'claude-code/shader'
import type { Buffer } from 'claude-code/shader'

const tint = values({ r: [0, 1], g: [0, 1], b: [0, 1] })

const CELL = 12

const glow: Buffer = buffer({ scale: 0.25 }, p => {
  let e = glow.sample(p.uv).x * exp(-dt * 1.5)

  for (const q of pointers) {
    const live = 1 - min(q.gone * 3, 1)
    const d = length(p.point - q.at)

    e = max(e, (1 - smoothstep(8, 110, d)) * live)
  }

  return vec4(e, 0, 0, 1)
})

const dots = picture(p => {
  const center = (floor(p.point / CELL) + 0.5) * CELL
  const e = glow.sample(center / size).x
  const radius = e * 0.6
  const local = length(p.point - center) / CELL
  const dot = 1 - smoothstep(radius - 0.08, radius, local)
  const a = dot * min(e * 1.5, 1) * 0.5

  return vec4(tint.r * a, tint.g * a, tint.b * a, a)
})

export default shader({ fps: 30, passes: [glow, dots] })
