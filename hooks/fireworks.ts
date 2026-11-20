// Pixel fireworks, laid over any scene for a few seconds. Each burst is a
// rocket that climbs, then a ring of square sparks that fall as they fade.
// At rest (Reduce Motion) every spark is hidden, so nothing is left behind.
import type { Burst } from '../types'

const SPARKS = 28
const COLORS = ['#ffd84d', '#ff5fa8', '#5bf0c4', '#7aa8ff', '#ff8a3d', '#c78bff']

const n = (v: number) => Math.round(v * 10) / 10

const sparkKeys = (() => {
  let keys = ''

  for (let i = 0; i < SPARKS; i++) {
    const a = (i / SPARKS) * Math.PI * 2
    const dx = n(Math.cos(a) * 150)
    const dy = n(Math.sin(a) * 150)

    keys += `@keyframes fs${i} { 0% { opacity: 0; transform: translate(0, 0); } 2% { opacity: 1; } 65% { opacity: 1; transform: translate(${dx}px, ${dy}px); } 100% { opacity: 0; transform: translate(${n(dx * 1.1)}px, ${n(dy * 1.1 + 70)}px); } }`
  }

  return keys
})()

const STYLE = `<style>
.fw-s { opacity: 0; animation-duration: 1.9s; animation-timing-function: cubic-bezier(0.1, 0.7, 0.3, 1); animation-fill-mode: both; animation-iteration-count: 1; }
.fw-r { opacity: 0; animation-duration: 0.7s; animation-timing-function: ease-out; animation-iteration-count: 1; animation-fill-mode: both; }
.fw-f { opacity: 0; animation: fwf 1.2s ease-out 1 both; }
@keyframes fwf { 0% { opacity: 0; } 8% { opacity: 0.28; } 100% { opacity: 0; } }
${sparkKeys}
</style>`

type Spot = { x: number; y: number; delay: number; color: string; scale: number }

const spots = (b: Burst): Spot[] => {
  let seed = (b.id % 2147483646) + 1
  const rand = () => {
    seed = (seed * 16807) % 2147483647

    return (seed - 1) / 2147483646
  }
  const count = b.kind === 'merge' ? 7 : b.kind === 'commit' ? 3 : 1
  const list: Spot[] = []

  for (let k = 0; k < count; k++) {
    const atClick = b.kind === 'click' || (b.kind === 'small' && k === 0)

    list.push({
      x: atClick ? b.x * 1600 : 160 + rand() * 1280,
      y: atClick ? b.y * 1000 : 110 + rand() * 300,
      delay: k * 0.45 + rand() * 0.2,
      color: COLORS[Math.floor(rand() * COLORS.length)] ?? '#ffd84d',
      scale: b.kind === 'merge' ? 0.9 + rand() * 0.5 : 0.8 + rand() * 0.3,
    })
  }

  return list
}

// The fireworks for one burst, as markup to set just before a scene's </svg>.
export const fireworks = (b: Burst): string => {
  let out = STYLE
  let rockets = ''

  spots(b).forEach((s, k) => {
    const rise = n(1000 - s.y)
    const boom = n(s.delay + 0.7)

    out += `<g shape-rendering="crispEdges">`
    rockets += `@keyframes fr${k} { 0% { opacity: 1; transform: translateY(0); } 90% { opacity: 1; } 100% { opacity: 0; transform: translateY(-${rise}px); } }`
    out += `<rect class="fw-r" x="${n(s.x - 3)}" y="1000" width="6" height="14" fill="${s.color}" style="animation-name:fr${k};animation-delay:${n(s.delay)}s"/>`
    out += `<circle class="fw-f" cx="${n(s.x)}" cy="${n(s.y)}" r="${n(70 * s.scale)}" fill="${s.color}" style="animation-delay:${boom}s"/>`
    out += `<g transform="translate(${n(s.x)} ${n(s.y)}) scale(${n(s.scale)})">`
    for (let i = 0; i < SPARKS; i++) {
      const size = i % 3 === 0 ? 8 : 6

      out += `<rect class="fw-s" x="${-size / 2}" y="${-size / 2}" width="${size}" height="${size}" fill="${i % 4 === 0 ? '#ffffff' : s.color}" style="animation-name:fs${i};animation-delay:${boom}s"/>`
    }
    out += `</g></g>`
  })

  return `${out}<style>${rockets}</style>`
}

// How long the longest burst takes, so the overlay can be cleared after.
export const burstMs = (b: Burst) => (b.kind === 'merge' ? 6500 : b.kind === 'commit' ? 4500 : 3200)
