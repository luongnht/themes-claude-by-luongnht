// Five more pixel scenes: sky, rainy city, cherry blossom, autumn, space.
// Same rules as the first five: small subjects at the edges, slow motion,
// the middle of the window left quiet for the conversation.
import { cells, n, open, pixelStars, ridge, rng, sprite } from './pixel'

// Distance from a point to a segment, for drawing branches in cells.
const toSegment = (px: number, py: number, ax: number, ay: number, bx: number, by: number) => {
  const dx = bx - ax
  const dy = by - ay
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)))

  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
}

// A tile of small sprites scattered at random, for a pattern that falls.
const spriteTile = (seed: number, w: number, h: number, count: number, rows: string[], b: number, classes: string[]) => {
  const r = rng(seed)
  let out = ''

  for (let k = 0; k < count; k++) {
    const cls = classes[k % classes.length] ?? classes[0] ?? ''

    out += `<g transform="translate(${Math.round(r() * (w - 20))} ${Math.round(r() * (h - 20))})">${sprite(rows, b, { X: cls })}</g>`
  }

  return out
}

const FALLING = `
.fallA { animation: fallY 60s linear infinite; }
.fallB { animation: fallY 42s linear infinite; }
.swayA { animation: swayX 13s ease-in-out infinite alternate; }
.swayB { animation: swayX 9s ease-in-out infinite alternate-reverse; }
@keyframes fallY { from { transform: translateY(0); } to { transform: translateY(1000px); } }
@keyframes swayX { from { transform: translateX(-14px); } to { transform: translateX(14px); } }
`

// 6. Blue sky and white clouds; a pink dusk by night.
const cloud = (w: number, h: number, b: number, ox: number, oy: number) =>
  cells(w, h, b, ox, oy, (i, j) => {
    const e = (cx: number, cy: number, rx: number, ry: number) => ((i - cx) / rx) ** 2 + ((j - cy) / ry) ** 2 <= 1

    return e(w * 0.3, h * 0.62, w * 0.3, h * 0.42) || e(w * 0.55, h * 0.42, w * 0.27, h * 0.45) || e(w * 0.76, h * 0.66, w * 0.24, h * 0.36)
  })

const BIRD_A = ['X...X', '.X.X.', '..X..']
const BIRD_B = ['.....', 'XX.XX', '..X..']

export const SKY = `${open(`
.top { stop-color: #8ccaf2; } .low { stop-color: #e2f2fb; }
.cl { fill: #ffffff; opacity: 0.92; } .cl2 { fill: #ffffff; opacity: 0.6; }
.bird { fill: #33506b; }
.hill1 { fill: #bfe0c0; } .hill2 { fill: #a3d0a8; }
.pstar { display: none; }
@media (prefers-color-scheme: dark) {
  .top { stop-color: #1d1a44; } .low { stop-color: #c97c96; }
  .cl { fill: #f3b9c9; opacity: 0.75; } .cl2 { fill: #e7a3bd; opacity: 0.45; }
  .bird { fill: #2a2147; }
  .hill1 { fill: #3d2f62; } .hill2 { fill: #2b2149; }
  .pstar { display: inline; fill: #fff2f7; }
}
.d1 { animation: drift 200s ease-in-out infinite alternate; }
.d2 { animation: drift 260s ease-in-out infinite alternate-reverse; }
.flock { animation: flock 110s linear -35s infinite; }
.wa { animation: wingA 1.4s steps(1, end) infinite; }
.wb { opacity: 0; animation: wingB 1.4s steps(1, end) infinite; }
@keyframes drift { from { transform: translateX(-60px); } to { transform: translateX(60px); } }
@keyframes flock { from { transform: translateX(1750px); } to { transform: translateX(-250px); } }
@keyframes wingA { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 0; } }
@keyframes wingB { 0% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 1; } }
`)}
<defs><linearGradient id="sky6" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="top"/><stop offset="1" class="low"/></linearGradient></defs>
<rect width="1600" height="1000" fill="url(#sky6)"/>
<g>${pixelStars(101, 18, 300, 3)}</g>
<g class="d2"><path class="cl2" d="${cloud(26, 7, 7, 520, 90)}${cloud(20, 6, 7, 980, 210)}"/></g>
<g class="d1"><path class="cl" d="${cloud(30, 9, 8, 40, 60)}${cloud(26, 8, 8, 1340, 110)}${cloud(22, 7, 8, 1240, 780)}${cloud(24, 7, 8, 60, 820)}"/></g>
<g class="flock"><g transform="translate(0 150)">
${[[0, 0], [26, 12], [52, -6]].map(([x, y]) => `<g transform="translate(${x} ${y})"><g class="wa">${sprite(BIRD_A, 3, { X: 'bird' })}</g><g class="wb">${sprite(BIRD_B, 3, { X: 'bird' })}</g></g>`).join('')}
</g></g>
${ridge(111, 960, 18, 48, 'hill1')}
${ridge(123, 982, 8, 64, 'hill2')}
</svg>`

// 7. A city at night in the rain: towers at both edges, lit windows, thin rain.
const city = () => {
  const r = rng(7)
  let towers = ''
  let windows = ''
  let blinks = ''
  let x = -20

  while (x < 1620) {
    const w = 60 + Math.round(r() * 70)
    const mid = x + w / 2
    const edge = mid < 420 || mid > 1180
    const h = edge ? 140 + Math.round(r() * 170) : 40 + Math.round(r() * 60)
    const top = 1000 - h

    towers += `<rect class="tw" x="${x}" y="${top}" width="${w}" height="${h}"/>`
    for (let wy = top + 14; wy < 990; wy += 22) {
      for (let wx = x + 10; wx < x + w - 12; wx += 18) {
        const roll = r()

        if (roll < 0.28) {
          windows += `<rect x="${wx}" y="${wy}" width="8" height="10"/>`
        } else if (roll < 0.31) {
          blinks += `<rect class="bw" x="${wx}" y="${wy}" width="8" height="10" style="animation-delay:${n(r() * -40)}s;animation-duration:${n(30 + r() * 30)}s"/>`
        }
      }
    }
    x += w + Math.round(r() * 6)
  }

  return { towers, windows, blinks }
}
const town = city()

const rainTile = (() => {
  const r = rng(17)
  let out = ''

  for (let k = 0; k < 14; k++) {
    out += `<rect x="${Math.round(r() * 190)}" y="${Math.round(r() * 230)}" width="2" height="${12 + Math.round(r() * 10)}"/>`
  }

  return out
})()

export const CITY = `${open(`
.top { stop-color: #aebccb; } .low { stop-color: #dde3e9; }
.tw { fill: #8e9cab; } .win { fill: #c3ccd5; } .bw { fill: #c3ccd5; }
.rn { fill: #6d7f92; } .rain { opacity: 0.35; }
.haze { fill: #ffffff; opacity: 0.25; }
@media (prefers-color-scheme: dark) {
  .top { stop-color: #070b17; } .low { stop-color: #1b2236; }
  .tw { fill: #121a2b; } .win { fill: #ffd36b; } .bw { fill: #ffd36b; }
  .rn { fill: #8fa6c9; } .rain { opacity: 0.3; }
  .haze { fill: #3b4b74; opacity: 0.25; }
}
.win { opacity: 0.85; }
.bw { opacity: 0.85; animation-name: lamp; animation-timing-function: steps(1, end); animation-iteration-count: infinite; }
.pour { animation: pour 5s linear infinite; }
@keyframes lamp { 0% { opacity: 0.85; } 70% { opacity: 0.1; } 100% { opacity: 0.1; } }
@keyframes pour { from { transform: translateY(0); } to { transform: translateY(1000px); } }
`)}
<defs>
<linearGradient id="sky7" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="top"/><stop offset="1" class="low"/></linearGradient>
<pattern id="rain7" width="200" height="250" patternUnits="userSpaceOnUse"><g class="rn">${rainTile}</g></pattern>
<linearGradient id="fog7" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="1"/></linearGradient>
<mask id="fogm7"><rect y="700" width="1600" height="300" fill="url(#fog7)"/></mask>
</defs>
<rect width="1600" height="1000" fill="url(#sky7)"/>
<g>${town.towers}</g>
<g class="win">${town.windows}</g>
<g>${town.blinks}</g>
<rect class="haze" y="700" width="1600" height="300" mask="url(#fogm7)"/>
<g class="rain"><g transform="skewX(-12)"><g class="pour"><rect x="-200" y="-1000" width="2200" height="2000" fill="url(#rain7)"/></g></g></g>
</svg>`

// 8. Cherry blossom: a branch from the top left corner, petals drifting down.
const BRANCH_SEGS: [number, number, number, number, number][] = [
  [0, 0, 30, 18, 2.2],
  [30, 18, 52, 22, 1.5],
  [30, 18, 38, 36, 1.3],
  [16, 9, 20, 26, 1.1],
  [52, 22, 66, 18, 0.9],
]
const BLOOMS: [number, number][] = [
  [52, 20], [58, 15], [67, 17], [45, 25], [38, 37], [34, 30], [20, 27], [23, 19], [28, 12], [9, 3], [46, 15], [62, 25],
  [41, 41], [15, 14], [33, 22], [55, 26], [70, 13], [26, 32], [5, 9], [42, 31],
]
const branch = (ox: number, oy: number, b: number, flip: boolean) => {
  const cols = 72
  const rows = 46
  const fx = (i: number) => (flip ? cols - 1 - i : i)
  const wood = cells(cols, rows, b, ox, oy, (i, j) => BRANCH_SEGS.some(([ax, ay, bx, by, t]) => toSegment(fx(i), j, ax, ay, bx, by) <= t))
  const petal = cells(cols, rows, b, ox, oy, (i, j) => BLOOMS.some(([cx, cy]) => { const d = Math.abs(fx(i) - cx) + Math.abs(j - cy); return d >= 1 && d <= 2 }))
  const heart = cells(cols, rows, b, ox, oy, (i, j) => BLOOMS.some(([cx, cy]) => fx(i) === cx && j === cy))

  return `<path class="wood" d="${wood}"/><path class="bloom" d="${petal}"/><path class="heart" d="${heart}"/>`
}

const PETAL = ['XX.', 'XXX', '.X.']

export const SAKURA = `${open(`
.top { stop-color: #f9dbe5; } .low { stop-color: #fdf4f6; }
.wood { fill: #6b4a4f; } .bloom { fill: #f4a3bd; } .heart { fill: #fff4f7; }
.pa { fill: #f2a0b9; } .pb { fill: #f7c4d3; }
.moon { fill: #ffffff; opacity: 0; }
.pstar { display: none; }
@media (prefers-color-scheme: dark) {
  .top { stop-color: #14122c; } .low { stop-color: #3a2b55; }
  .wood { fill: #0c0a1a; } .bloom { fill: #f1cfe0; } .heart { fill: #ffd6e7; }
  .pa { fill: #f1cfe0; } .pb { fill: #d9a8c6; }
  .moon { opacity: 0.95; fill: #fbf3ff; }
  .pstar { display: inline; fill: #fbe9f5; }
}
.bough { animation: bough 14s ease-in-out infinite alternate; transform-origin: 0 0; }
.bough2 { animation: bough 17s ease-in-out infinite alternate-reverse; transform-origin: 1600px 0; }
@keyframes bough { from { transform: rotate(-0.6deg); } to { transform: rotate(0.6deg); } }
${FALLING}
`)}
<defs>
<linearGradient id="sky8" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="top"/><stop offset="1" class="low"/></linearGradient>
<pattern id="pet8a" width="530" height="500" patternUnits="userSpaceOnUse">${spriteTile(23, 530, 500, 4, PETAL, 3, ['pa', 'pb'])}</pattern>
<pattern id="pet8b" width="610" height="500" patternUnits="userSpaceOnUse">${spriteTile(37, 610, 500, 2, PETAL, 4, ['pb', 'pa'])}</pattern>
</defs>
<rect width="1600" height="1000" fill="url(#sky8)"/>
<g>${pixelStars(131, 20, 600, 3)}</g>
<path class="moon" d="${cells(11, 11, 5, 1380, 260, (i, j) => Math.hypot(i - 5, j - 5) <= 5.2)}"/>
<g class="bough">${branch(-6, -6, 6, false)}</g>
<g class="bough2">${branch(1606 - 72 * 5, -6, 5, true)}</g>
<g class="fallA"><g class="swayA"><rect x="-100" y="-1000" width="1800" height="2000" fill="url(#pet8a)"/></g></g>
<g class="fallB"><g class="swayB"><rect x="-100" y="-1000" width="1800" height="2000" fill="url(#pet8b)"/></g></g>
</svg>`

// 9. Autumn: warm hills, round pixel trees in the corners, leaves falling.
const tree = (cx: number, ground: number, b: number, radius: number) => {
  const cols = radius * 2 + 1
  const rows = radius * 2 + 6
  const ox = cx - (radius + 0.5) * b
  const oy = ground - rows * b
  const r = rng(cx + ground)
  const speck = new Set<string>()

  for (let k = 0; k < radius * radius; k++) {
    speck.add(`${Math.floor(r() * cols)},${Math.floor(r() * radius * 2)}`)
  }
  const inCrown = (i: number, j: number) => Math.hypot(i - radius, j - radius) <= radius + 0.3
  const crown = cells(cols, rows, b, ox, oy, (i, j) => inCrown(i, j) && !speck.has(`${i},${j}`))
  const dots = cells(cols, rows, b, ox, oy, (i, j) => inCrown(i, j) && speck.has(`${i},${j}`))
  const trunk = cells(cols, rows, b, ox, oy, (i, j) => j > radius * 1.6 && Math.abs(i - radius) <= (j > rows - 2 ? 1 : 0))

  return `<path class="trunk" d="${trunk}"/><path class="crown" d="${crown}"/><path class="crown2" d="${dots}"/>`
}

const LEAF = ['..X..', '.XXX.', 'XXXXX', '.XXX.', '..X..']

export const AUTUMN = `${open(`
.top { stop-color: #f6e3c6; } .low { stop-color: #f1cfa6; }
.h1 { fill: #e7b98c; } .h2 { fill: #d79a6c; }
.trunk { fill: #6b4129; } .crown { fill: #e0782f; } .crown2 { fill: #f2b33d; }
.la { fill: #e0782f; } .lb { fill: #c9452f; } .lc { fill: #e9a93a; }
.pstar { display: none; }
@media (prefers-color-scheme: dark) {
  .top { stop-color: #241520; } .low { stop-color: #6a3326; }
  .h1 { fill: #3d1f22; } .h2 { fill: #2a1418; }
  .trunk { fill: #1a0d0f; } .crown { fill: #a8441f; } .crown2 { fill: #d0782a; }
  .la { fill: #d36a2a; } .lb { fill: #b33d2a; } .lc { fill: #dc9a35; }
  .pstar { display: inline; fill: #ffe7cc; }
}
.rustle { animation: rustle 12s ease-in-out infinite alternate; transform-origin: 0 1000px; }
@keyframes rustle { from { transform: skewX(-0.5deg); } to { transform: skewX(0.5deg); } }
${FALLING}
`)}
<defs>
<linearGradient id="sky9" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="top"/><stop offset="1" class="low"/></linearGradient>
<pattern id="leaf9a" width="530" height="500" patternUnits="userSpaceOnUse">${spriteTile(41, 530, 500, 3, LEAF, 3, ['la', 'lb', 'lc'])}</pattern>
<pattern id="leaf9b" width="610" height="500" patternUnits="userSpaceOnUse">${spriteTile(53, 610, 500, 2, LEAF, 4, ['lc', 'la'])}</pattern>
</defs>
<rect width="1600" height="1000" fill="url(#sky9)"/>
<g>${pixelStars(141, 16, 400, 3)}</g>
${ridge(151, 930, 30, 48, 'h1')}
<g class="rustle">${tree(90, 975, 8, 10)}${tree(230, 985, 6, 7)}${tree(1500, 980, 8, 9)}</g>
${ridge(163, 975, 10, 64, 'h2')}
<g class="fallA"><g class="swayA"><rect x="-100" y="-1000" width="1800" height="2000" fill="url(#leaf9a)"/></g></g>
<g class="fallB"><g class="swayB"><rect x="-100" y="-1000" width="1800" height="2000" fill="url(#leaf9b)"/></g></g>
</svg>`

// 10. Space: a ringed planet in the corner, a small moon, a comet now and then.
const PR = 16
const planet = (() => {
  const b = 6
  const size = PR * 4 + 1
  const ox = 1440 - (size / 2) * b
  const oy = 830 - (size / 2) * b
  const c = size / 2 - 0.5
  const inPlanet = (i: number, j: number) => Math.hypot(i - c, j - c) <= PR
  const ring = (i: number, j: number) => {
    const x = i - c
    const y = (j - c) * 3.2 + x * 0.55
    const d = Math.hypot(x, y) / (PR * 1.9)

    return d >= 0.8 && d <= 1 && !(inPlanet(i, j) && y < 0)
  }
  const band = (j: number) => Math.floor((j - c + PR) / 4) % 2 === 0
  const body = cells(size, size, b, ox, oy, (i, j) => inPlanet(i, j) && band(j))
  const body2 = cells(size, size, b, ox, oy, (i, j) => inPlanet(i, j) && !band(j))
  const rings = cells(size, size, b, ox, oy, ring)

  return `<path class="pl1" d="${body}"/><path class="pl2" d="${body2}"/><path class="ring" d="${rings}"/>`
})()

const comet = (() => {
  let tail = ''

  for (let k = 0; k < 9; k++) {
    tail += `<rect x="${k * 10}" y="${-k * 5}" width="${6 - Math.floor(k / 3)}" height="${6 - Math.floor(k / 3)}" opacity="${n(1 - k / 9)}"/>`
  }

  return tail
})()

export const SPACE = `${open(`
.pstar { fill: #e9e4ff; }
.pl1 { fill: #c8873f; } .pl2 { fill: #e9b56a; } .ring { fill: #b7a6e6; opacity: 0.85; }
.mn { fill: #9b97b8; } .mn2 { fill: #77739a; }
.neb { fill: #8b5cf6; } .nebula { opacity: 0.16; }
.cmt { fill: #cfe8ff; }
.drift1 { animation: drift 240s linear infinite alternate; }
.drift2 { animation: drift 160s linear infinite alternate-reverse; }
.float { animation: float 24s ease-in-out infinite alternate; }
.comet { opacity: 0; animation: comet 44s linear 8s infinite; }
@keyframes drift { from { transform: translateX(-20px); } to { transform: translateX(20px); } }
@keyframes float { from { transform: translateY(-4px); } to { transform: translateY(4px); } }
@keyframes comet { 0% { transform: translate(0, 0); opacity: 0; } 2% { opacity: 1; } 14% { transform: translate(-700px, 350px); opacity: 0; } 100% { transform: translate(-700px, 350px); opacity: 0; } }
`)}
<defs>
<linearGradient id="sky10" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#06051a"/><stop offset="1" stop-color="#170e36"/></linearGradient>
<pattern id="dot10" width="14" height="14" patternUnits="userSpaceOnUse"><circle class="neb" cx="7" cy="7" r="2.4"/></pattern>
<radialGradient id="fade10"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>
<mask id="nebm"><ellipse cx="260" cy="200" rx="380" ry="160" fill="url(#fade10)"/></mask>
</defs>
<rect width="1600" height="1000" fill="url(#sky10)"/>
<rect class="nebula" width="1600" height="1000" fill="url(#dot10)" mask="url(#nebm)"/>
<g class="drift1">${pixelStars(171, 50, 1000, 2)}</g>
<g class="drift2">${pixelStars(181, 24, 1000, 3)}</g>
<g class="float"><path class="mn" d="${cells(13, 13, 5, 150, 90, (i, j) => Math.hypot(i - 6, j - 6) <= 6.2)}"/><path class="mn2" d="${cells(13, 13, 5, 150, 90, (i, j) => (i === 4 && j === 4) || (i === 8 && j === 7) || (i === 5 && j === 9) || (i === 9 && j === 3))}"/></g>
<g class="float" style="animation-duration:30s">${planet}</g>
<g class="comet"><g class="cmt" transform="translate(1500 90)">${comet}</g></g>
</svg>`
