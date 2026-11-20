// Four pixel and halftone scenes, each a whole SVG built once at load.
// Every scene is 1600 x 1000, sliced to fill the window, with its subject
// kept to the edges and corners so the words in the middle stay clear.

const rng = (start: number) => {
  let s = start

  return () => {
    s = (s * 16807) % 2147483647

    return (s - 1) / 2147483646
  }
}
const n = (v: number) => Math.round(v * 10) / 10

// One path from a grid of cells: each row's runs become one rectangle.
const cells = (cols: number, rows: number, b: number, ox: number, oy: number, inside: (i: number, j: number) => boolean) => {
  let d = ''

  for (let j = 0; j < rows; j++) {
    let i = 0

    while (i < cols) {
      if (!inside(i, j)) {
        i++
        continue
      }
      const start = i

      while (i < cols && inside(i, j)) {
        i++
      }
      d += `M${n(ox + start * b)} ${n(oy + j * b)}h${n((i - start) * b)}v${b}h${n(-(i - start) * b)}z`
    }
  }

  return d
}

// A sprite from rows of letters: each letter a class, '.' empty.
const sprite = (rows: string[], b: number, cls: Record<string, string>) => {
  let out = ''

  for (const key of Object.keys(cls)) {
    const d = cells(rows[0]?.length ?? 0, rows.length, b, 0, 0, (i, j) => rows[j]?.[i] === key)

    if (d !== '') {
      out += `<path class="${cls[key]}" d="${d}"/>`
    }
  }

  return out
}

// Pixel stars that twinkle in steps, as old screens do.
const pixelStars = (seed: number, count: number, maxY: number, size: number) => {
  const r = rng(seed)
  let out = ''

  for (let k = 0; k < count; k++) {
    const s = r() > 0.8 ? size * 2 : size

    out += `<rect class="pstar" x="${n(r() * 1600)}" y="${n(r() * maxY)}" width="${s}" height="${s}" style="animation-delay:${n(r() * 6)}s;animation-duration:${n(3 + r() * 5)}s"/>`
  }

  return out
}

// A stepped ridge along the bottom.
const ridge = (seed: number, base: number, rough: number, step: number, cls: string) => {
  const r = rng(seed)
  let d = `M-40 1000V${base}`
  let y = base

  for (let x = -40; x <= 1640; x += step) {
    y = Math.max(base - rough, Math.min(base + rough * 0.4, y + (r() - 0.5) * rough * 0.7))
    const yy = Math.round(y / 8) * 8

    d += `V${yy}H${x + step}`
  }

  return `<path class="${cls}" d="${d}V1000Z"/>`
}

const PIXEL_BASE = `
.pstar { opacity: 0.8; animation-name: blink; animation-timing-function: steps(2, jump-none); animation-iteration-count: infinite; }
@keyframes blink { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.75; } }
`

const open = (style: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges"><style>${PIXEL_BASE}${style}</style>`

// 1. Halftone dusk: a sun of dots sinking in the corner, dotted haze drifting.
const halftoneSun = (cx: number, cy: number, radius: number, gap: number) => {
  const rings = ['', '', '']

  for (let y = cy - radius; y <= cy + radius; y += gap) {
    for (let x = cx - radius; x <= cx + radius; x += gap) {
      const d = Math.hypot(x - cx, y - cy)

      if (d > radius) {
        continue
      }
      const t = 1 - d / radius
      const r = n(gap * 0.5 * Math.pow(t, 0.7))

      if (r < 0.8) {
        continue
      }
      const band = t > 0.66 ? 0 : t > 0.33 ? 1 : 2

      rings[band] += `<circle cx="${x}" cy="${y}" r="${r}"/>`
    }
  }

  return `<g class="sun-in">${rings[0]}</g><g class="sun-mid">${rings[1]}</g><g class="sun-out">${rings[2]}</g>`
}

export const DUSK = `${open(`
.top { stop-color: #f3e6cf; } .low { stop-color: #f6cfae; }
.sun-in { fill: #f0a347; } .sun-mid { fill: #e8743b; } .sun-out { fill: #c94d4d; }
.hz { fill: #2a2350; } .haze { opacity: 0.16; }
.hill-far { fill: #e9b99a; } .hill-near { fill: #d99b84; }
@media (prefers-color-scheme: dark) {
  .top { stop-color: #0e1230; } .low { stop-color: #3a1f4a; }
  .sun-in { fill: #ffc069; } .sun-mid { fill: #ff7a45; } .sun-out { fill: #c4415e; }
  .hz { fill: #ffd9b8; } .haze { opacity: 0.12; }
  .hill-far { fill: #231a3f; } .hill-near { fill: #150f2a; }
}
.sun { animation: sink 60s ease-in-out infinite alternate; }
.pulse { animation: pulse 24s ease-in-out infinite alternate; transform-origin: 1430px 850px; }
.drift1 { animation: drift 150s linear infinite alternate; }
.drift2 { animation: drift 190s linear infinite alternate-reverse; }
@keyframes sink { from { transform: translateY(-4px); } to { transform: translateY(6px); } }
@keyframes pulse { from { transform: scale(0.99); } to { transform: scale(1.01); } }
@keyframes drift { from { transform: translateX(-50px); } to { transform: translateX(50px); } }
`)}
<defs>
<linearGradient id="dsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="top"/><stop offset="1" class="low"/></linearGradient>
<pattern id="dot" width="14" height="14" patternUnits="userSpaceOnUse"><circle class="hz" cx="7" cy="7" r="2.4"/></pattern>
<radialGradient id="fadeA"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>
<mask id="cloudA"><ellipse cx="420" cy="230" rx="420" ry="90" fill="url(#fadeA)"/></mask>
<mask id="cloudB"><ellipse cx="1180" cy="140" rx="360" ry="70" fill="url(#fadeA)"/></mask>
<mask id="cloudC"><ellipse cx="700" cy="420" rx="300" ry="50" fill="url(#fadeA)"/></mask>
</defs>
<rect width="1600" height="1000" fill="url(#dsk)"/>
<!-- the sun of dots in the lower right corner -->
<svg x="0" y="0" width="1600" height="1000" viewBox="0 0 1600 1000" preserveAspectRatio="xMaxYMax meet">
<g class="sun"><g class="pulse">${halftoneSun(1430, 850, 180, 15)}</g></g>
</svg>
<!-- dotted haze -->
<g class="drift1"><rect class="haze" width="1600" height="600" fill="url(#dot)" mask="url(#cloudA)"/></g>
<g class="drift2"><rect class="haze" width="1600" height="600" fill="url(#dot)" mask="url(#cloudB)"/></g>
<g class="drift1"><rect class="haze" width="1600" height="600" fill="url(#dot)" mask="url(#cloudC)"/></g>
${ridge(11, 945, 26, 48, 'hill-far')}
${ridge(23, 975, 16, 32, 'hill-near')}
</svg>`

// 2. Pixel pines in snow: trees at both edges, two layers of falling snow.
const pine = (cx: number, ground: number, b: number, tiers: number, cls: string, snow: string) => {
  const rows = tiers * 4 + 2
  const width = tiers + 4
  const cols = width * 2 + 1
  const ox = cx - width * b - b / 2
  const oy = ground - rows * b
  const half = (j: number) => {
    if (j >= rows - 2) {
      return -1
    }
    const tier = Math.floor(j / 4)
    const pos = j % 4

    return pos + tier
  }
  const body = cells(cols, rows, b, ox, oy, (i, j) => {
    const h = half(j)

    return h < 0 ? i === width : Math.abs(i - width) <= h
  })
  const caps = cells(cols, rows, b, ox, oy, (i, j) => {
    const h = half(j)

    return h >= 0 && j % 4 === 0 && Math.abs(i - width) <= h
  })

  return `<path class="${cls}" d="${body}"/><path class="${snow}" d="${caps}"/>`
}

const snowTile = (seed: number, w: number, h: number, count: number, size: number) => {
  const r = rng(seed)
  let out = ''

  for (let k = 0; k < count; k++) {
    out += `<rect x="${Math.round(r() * w)}" y="${Math.round(r() * h)}" width="${size}" height="${size}"/>`
  }

  return out
}

const forest = () => {
  const r = rng(5)
  let far = ''
  let near = ''

  for (const x of [60, 150, 240, 1360, 1450, 1540]) {
    far += pine(x + r() * 20, 945, 6, 3 + Math.floor(r() * 2), 'tree-far', 'cap-far')
  }
  for (const x of [10, 110, 1490, 1590]) {
    near += pine(x + r() * 16, 1000, 10, 3 + Math.floor(r() * 2), 'tree-near', 'cap-near')
  }

  return { far, near }
}
const trees = forest()

const moon = cells(13, 13, 5, 1460, 70, (i, j) => Math.hypot(i - 6, j - 6) <= 6.2)
const moonShade = cells(13, 13, 5, 1460, 70, (i, j) => Math.hypot(i - 6, j - 6) <= 6.2 && Math.hypot(i - 9, j - 4) <= 5)

export const PINES = `${open(`
.top { stop-color: #cfdbe6; } .low { stop-color: #eef3f6; }
.tree-far { fill: #9fb6bf; } .cap-far { fill: #eef4f7; }
.tree-near { fill: #4f7a73; } .cap-near { fill: #ffffff; }
.ground { fill: #f5f8fa; } .ground2 { fill: #e3ebef; }
.snow { fill: #ffffff; } .moon { fill: #ffffff; opacity: 0.8; } .shade { fill: #cfdbe6; opacity: 0; }
.pstar { display: none; }
.snow1, .snow2 { fill: #8aa3ae; }
@media (prefers-color-scheme: dark) {
  .top { stop-color: #070d1c; } .low { stop-color: #1a2b40; }
  .tree-far { fill: #1c3040; } .cap-far { fill: #8fa7bb; }
  .tree-near { fill: #0c1b22; } .cap-near { fill: #dbe7f0; }
  .ground { fill: #c9d7e2; } .ground2 { fill: #8ea3b5; }
  .moon { fill: #f3f0dc; opacity: 1; } .shade { fill: #070d1c; opacity: 0.9; }
  .pstar { display: inline; }
  .snow1, .snow2 { fill: #ffffff; }
}
.fall1 { animation: fall 50s linear infinite; }
.fall2 { animation: fall 32s linear infinite; }
.sway1 { animation: sway 14s ease-in-out infinite alternate; }
.sway2 { animation: sway 11s ease-in-out infinite alternate-reverse; }
@keyframes fall { from { transform: translateY(0); } to { transform: translateY(1000px); } }
@keyframes sway { from { transform: translateX(-10px); } to { transform: translateX(10px); } }
`)}
<defs>
<linearGradient id="pn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="top"/><stop offset="1" class="low"/></linearGradient>
<pattern id="sn1" width="200" height="200" patternUnits="userSpaceOnUse"><g class="snow1">${snowTile(3, 196, 196, 4, 3)}</g></pattern>
<pattern id="sn2" width="250" height="250" patternUnits="userSpaceOnUse"><g class="snow2">${snowTile(9, 242, 242, 2, 5)}</g></pattern>
</defs>
<rect width="1600" height="1000" fill="url(#pn)"/>
<g>${pixelStars(31, 28, 500, 3)}</g>
<path class="moon" d="${moon}"/><path class="shade" d="${moonShade}"/>
<g class="fall1"><g class="sway1"><rect x="-100" y="-1000" width="1800" height="2000" fill="url(#sn1)"/></g></g>
${trees.far}
${ridge(41, 955, 12, 40, 'ground2')}
${trees.near}
${ridge(17, 985, 8, 56, 'ground')}
<g class="fall2"><g class="sway2"><rect x="-100" y="-1000" width="1800" height="2000" fill="url(#sn2)"/></g></g>
</svg>`

// 3. Synthwave: a striped pixel sun, a grid rolling toward you, a night of stars.
const SUN_R = 22
const sunCells = cells(SUN_R * 2 + 1, SUN_R * 2 + 1, 5, 1360 - SUN_R * 5, 110, (i, j) => {
  if (Math.hypot(i - SUN_R, j - SUN_R) > SUN_R + 0.3) {
    return false
  }
  const below = j - SUN_R

  if (below < 0) {
    return true
  }
  const band = 2 + Math.floor(below / 4)

  return below % 6 >= Math.min(4, Math.floor(band / 2))
})

const HORIZON = 740
const gridLines = () => {
  let lines = ''
  let keys = ''
  const count = 12
  const y = (t: number) => HORIZON + (1000 - HORIZON) * Math.pow(t / count, 2.2)

  for (let k = 0; k < count; k++) {
    lines += `<rect class="gl" x="-40" y="0" width="1680" height="3" style="animation-name:h${k}"/>`
    keys += `@keyframes h${k} { from { transform: translateY(${n(y(k))}px); } to { transform: translateY(${n(y(k + 1))}px); } }`
  }
  for (let k = -16; k <= 16; k++) {
    lines += `<line class="gv" x1="${800 + k * 22}" y1="${HORIZON}" x2="${800 + k * 150}" y2="1000"/>`
  }

  return { lines, keys }
}
const grid = gridLines()

export const SYNTH = `${open(`
.gl { fill: #ff4fa3; opacity: 0.6; animation-duration: 10s; animation-timing-function: linear; animation-iteration-count: infinite; }
.gv { stroke: #ff4fa3; stroke-width: 1.5; opacity: 0.4; }
.sunp { animation: hum 14s ease-in-out infinite alternate; }
.glow { animation: breath 14s ease-in-out infinite alternate; }
.pstar { fill: #ffe9ff; }
.m1 { fill: #3a1a63; } .m2 { fill: #24104a; }
@keyframes hum { from { transform: translateY(0); } to { transform: translateY(4px); } }
@keyframes breath { from { opacity: 0.45; } to { opacity: 0.65; } }
${grid.keys}
`)}
<defs>
<linearGradient id="sw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0520"/><stop offset="0.6" stop-color="#2a0d4a"/><stop offset="0.64" stop-color="#3d0f4f"/><stop offset="1" stop-color="#10061f"/></linearGradient>
<linearGradient id="sung" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe86b"/><stop offset="0.5" stop-color="#ff9a3c"/><stop offset="1" stop-color="#ff3d8b"/></linearGradient>
<radialGradient id="halo"><stop offset="0" stop-color="#ff5fa8" stop-opacity="0.5"/><stop offset="1" stop-color="#ff5fa8" stop-opacity="0"/></radialGradient>
<linearGradient id="fadeH" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a0d4a" stop-opacity="1"/><stop offset="1" stop-color="#2a0d4a" stop-opacity="0"/></linearGradient>
</defs>
<rect width="1600" height="1000" fill="url(#sw)"/>
<g>${pixelStars(77, 40, 640, 3)}</g>
<circle class="glow" cx="1360" cy="220" r="200" fill="url(#halo)"/>
<g class="sunp"><path d="${sunCells}" fill="url(#sung)"/></g>
${ridge(51, 705, 34, 40, 'm1').replace('V1000Z', `V${HORIZON}H-40Z`)}
${ridge(63, 720, 20, 24, 'm2').replace('V1000Z', `V${HORIZON}H-40Z`)}
<rect x="0" y="${HORIZON}" width="1600" height="${1000 - HORIZON}" fill="#14062a"/>
<g>${grid.lines}</g>
<rect x="0" y="${HORIZON}" width="1600" height="120" fill="url(#fadeH)"/>
<rect x="0" y="${HORIZON - 2}" width="1600" height="3" fill="#ff8ad0"/>
</svg>`

// 4. Pixel ocean: a sea turtle crossing slowly, rays of light, rising bubbles.
const TURTLE_A = [
  '........SSSSS.........',
  '......SSsSSsSSS.......',
  '.....SsSSsSSsSSS..KK..',
  '....SSSSSsSSSSSSSKKEK.',
  '...SSsSSSSSsSSSSSKKKKK',
  '..KSSSSSSSSSSSSSSSKK..',
  '.KK.BBBBBBBBBBBBB.....',
  'KK....KK.....KKK......',
  '.....KK.......KKK.....',
]
const TURTLE_B = [
  '........SSSSS.........',
  '......SSsSSsSSS.......',
  '.....SsSSsSSsSSS..KK..',
  '....SSSSSsSSSSSSSKKEK.',
  '...SSsSSSSSsSSSSSKKKKK',
  '.KKSSSSSSSSSSSSSSSKK..',
  'KK..BBBBBBBBBBBBB.....',
  '......KKK....KK.......',
  '.......KK.....KK......',
]
const TURTLE_CLS = { S: 'tsh', s: 'tpt', K: 'tsk', E: 'tey', B: 'tbe' }

const FISH = ['.YY.Y', 'YYYYY', '.YY.Y']

const seaweed = (x: number, h: number, b: number) =>
  cells(3, h, b, x, 1000 - h * b, (i, j) => (Math.floor(j / 3) % 2 === 0 ? i <= 1 : i >= 1))

const fishSchool = () => {
  let out = ''
  const r = rng(13)

  for (let k = 0; k < 4; k++) {
    out += `<g transform="translate(${n(r() * 110)} ${n(r() * 60)})">${sprite(FISH, 4, { Y: 'fish' })}</g>`
  }

  return out
}

export const OCEAN = `${open(`
.top { stop-color: #bfe8ea; } .low { stop-color: #7cc4cf; }
.ray { fill: #ffffff; opacity: 0.12; }
.sand { fill: #e8d9b0; } .sand2 { fill: #d6c48f; }
.weed { fill: #3c9a6b; } .weed2 { fill: #2b7a57; }
.bubc { fill: #ffffff; } .bub { opacity: 0.6; }
.fish { fill: #f0a347; }
.tsh { fill: #2f6d52; } .tpt { fill: #7cc28a; } .tsk { fill: #8fc79a; } .tey { fill: #0d2228; } .tbe { fill: #d8c27a; }
.pstar { display: none; }
@media (prefers-color-scheme: dark) {
  .top { stop-color: #0b3a4d; } .low { stop-color: #04121c; }
  .ray { fill: #7fe3ff; opacity: 0.06; }
  .sand { fill: #1d3640; } .sand2 { fill: #142a33; }
  .weed { fill: #1f6b55; } .weed2 { fill: #154d3e; }
  .bubc { fill: #bff4ff; } .bub { opacity: 0.45; }
  .fish { fill: #ffb35c; }
  .pstar { display: inline; fill: #9ff0ff; }
}
.swim { animation: swim 150s linear -40s infinite; }
.bob { animation: bob 10s ease-in-out infinite alternate; }
.fa { animation: flapA 2.6s steps(1, end) infinite; }
.fb { opacity: 0; animation: flapB 2.6s steps(1, end) infinite; }
.school { animation: school 120s linear -70s infinite; }
.rays { animation: rays 30s ease-in-out infinite alternate; transform-origin: 800px 0; }
.rise1 { animation: rise 45s linear infinite; }
.rise2 { animation: rise 30s linear infinite; }
.sway { animation: weed 9s ease-in-out infinite alternate; transform-origin: 0 1000px; }
@keyframes swim { from { transform: translateX(-300px); } to { transform: translateX(1900px); } }
@keyframes bob { from { transform: translateY(-4px); } to { transform: translateY(5px); } }
@keyframes flapA { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 0; } }
@keyframes flapB { 0% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 1; } }
@keyframes school { from { transform: translateX(1800px); } to { transform: translateX(-400px); } }
@keyframes rays { from { transform: skewX(-2deg); opacity: 0.8; } to { transform: skewX(2deg); opacity: 1; } }
@keyframes rise { from { transform: translateY(0); } to { transform: translateY(-1000px); } }
@keyframes weed { from { transform: skewX(-1.5deg); } to { transform: skewX(1.5deg); } }
`)}
<defs>
<linearGradient id="oc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="top"/><stop offset="1" class="low"/></linearGradient>
<pattern id="bb1" width="300" height="250" patternUnits="userSpaceOnUse"><g class="bubc">${snowTile(19, 290, 240, 2, 4)}</g></pattern>
<pattern id="bb2" width="420" height="250" patternUnits="userSpaceOnUse"><g class="bubc">${snowTile(29, 400, 240, 1, 6)}</g></pattern>
</defs>
<rect width="1600" height="1000" fill="url(#oc)"/>
<g>${pixelStars(91, 20, 900, 3)}</g>
<g class="rays">
<polygon class="ray" points="180,0 300,0 520,1000 340,1000"/>
<polygon class="ray" points="620,0 680,0 820,1000 720,1000"/>
<polygon class="ray" points="1080,0 1200,0 1380,1000 1200,1000"/>
<polygon class="ray" points="1400,0 1450,0 1580,1000 1500,1000"/>
</g>
<g class="rise1"><rect class="bub" x="0" y="0" width="1600" height="2000" fill="url(#bb1)"/></g>
<g class="school"><g transform="translate(0 820)">${fishSchool()}</g></g>
<g class="swim"><g transform="translate(0 110)"><g class="bob">
<g class="fa">${sprite(TURTLE_A, 5, TURTLE_CLS)}</g>
<g class="fb">${sprite(TURTLE_B, 5, TURTLE_CLS)}</g>
</g></g></g>
<g class="sway"><path class="weed" d="${seaweed(50, 14, 7)}${seaweed(95, 9, 7)}${seaweed(1500, 11, 7)}"/><path class="weed2" d="${seaweed(20, 8, 7)}${seaweed(1550, 15, 7)}"/></g>
${ridge(71, 975, 12, 40, 'sand2')}
${ridge(83, 990, 6, 64, 'sand')}
<g class="rise2"><rect class="bub" x="0" y="0" width="1600" height="2000" fill="url(#bb2)"/></g>
</svg>`
