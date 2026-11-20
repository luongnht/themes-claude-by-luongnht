// A small seeded random, so the sky is the same on every load.
let seed = 7
const rand = () => {
  seed = (seed * 16807) % 2147483647

  return (seed - 1) / 2147483646
}
const r1 = (n: number) => Math.round(n * 10) / 10

// Three star layers: far (tiny, slow), mid, near (bigger, faster drift).
const starLayer = (count: number, size: number, cls: string, maxY: number) => {
  let out = ''

  for (let i = 0; i < count; i++) {
    const delay = r1(rand() * 9)
    const dur = r1(5 + rand() * 7)

    out += `<circle class="star ${cls}" cx="${r1(rand() * 1700 - 50)}" cy="${r1(rand() * maxY)}" r="${r1(size * (0.6 + rand() * 0.8))}" style="animation-delay:${delay}s;animation-duration:${dur}s"/>`
  }

  return out
}

// Vertical light rays that hang from an aurora curve and shimmer.
const rays = (count: number, base: number, amp: number, phase: number, len: number, grad: string) => {
  let out = ''

  for (let i = 0; i < count; i++) {
    const x = -100 + (i * 1800) / count
    const y = base + Math.sin(x / 260 + phase) * amp
    const h = len * (0.6 + rand() * 0.7)
    const w = r1(10 + rand() * 22)
    const delay = r1(rand() * 8)
    const dur = r1(4 + rand() * 6)

    out += `<rect class="ray" x="${r1(x)}" y="${r1(y - h)}" width="${w}" height="${r1(h)}" fill="url(#${grad})" style="animation-delay:${delay}s;animation-duration:${dur}s"/>`
  }

  return out
}

export const AURORA = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<style>
:root, svg { color-scheme: light dark; }
.sky-top { stop-color: #d9d0f2; }
.sky-mid { stop-color: #e9e3f7; }
.sky-low { stop-color: #f6e6ef; }
.m-far { fill: #cfc6ea; }
.m-mid { fill: #b9addf; }
.m-near { fill: #9f90d0; }
.fog { fill: #ffffff; opacity: 0.45; }
.star { fill: #ffffff; opacity: 0; }
.aur { mix-blend-mode: multiply; opacity: 0.32; }
.moon { fill: #fff8ef; }
.moon-glow { stop-color: #ffe9c9; }
.shoot { opacity: 0; }
@media (prefers-color-scheme: dark) {
  .sky-top { stop-color: #05061a; }
  .sky-mid { stop-color: #0c0f2a; }
  .sky-low { stop-color: #1a1640; }
  .m-far { fill: #191a3d; }
  .m-mid { fill: #111230; }
  .m-near { fill: #080918; }
  .fog { fill: #6c74c9; opacity: 0.12; }
  .star { opacity: 0.7; animation-name: twinkle; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
  .aur { mix-blend-mode: screen; opacity: 0.55; }
  .moon { fill: #f4f1ff; }
  .moon-glow { stop-color: #b9c4ff; }
  .shoot { animation: shoot 31s linear infinite; }
  .shoot.k2 { animation-duration: 47s; animation-delay: 17s; }
}
.drift-far { animation: driftA 260s linear infinite alternate; }
.drift-mid { animation: driftB 200s linear infinite alternate; }
.drift-near { animation: driftC 150s linear infinite alternate; }
.a1 { animation: sway1 70s ease-in-out infinite alternate; transform-origin: 800px 260px; }
.a2 { animation: sway2 85s ease-in-out infinite alternate; transform-origin: 600px 200px; }
.a3 { animation: sway3 100s ease-in-out infinite alternate; transform-origin: 1100px 360px; }
.breathe { animation: breathe 30s ease-in-out infinite alternate; }
.ray { opacity: 0.55; animation-name: shimmer; animation-timing-function: ease-in-out; animation-iteration-count: infinite; animation-direction: alternate; }
.p-far { animation: par1 160s ease-in-out infinite alternate; }
.p-mid { animation: par2 120s ease-in-out infinite alternate; }
.p-near { animation: par3 90s ease-in-out infinite alternate; }
.fog1 { animation: fogA 140s ease-in-out infinite alternate; }
.fog2 { animation: fogB 180s ease-in-out infinite alternate; }
.halo { animation: halo 24s ease-in-out infinite alternate; transform-origin: 1450px 100px; }
@keyframes twinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
@keyframes driftA { from { transform: translateX(0); } to { transform: translateX(-40px); } }
@keyframes driftB { from { transform: translateX(0); } to { transform: translateX(-80px); } }
@keyframes driftC { from { transform: translateX(0); } to { transform: translateX(-140px); } }
@keyframes sway1 { from { transform: translateX(-30px) skewX(-2deg) scaleY(0.98); } to { transform: translateX(35px) skewX(2deg) scaleY(1.03); } }
@keyframes sway2 { from { transform: translateX(35px) scaleY(0.97) rotate(-1deg); } to { transform: translateX(-40px) scaleY(1.03) rotate(1deg); } }
@keyframes sway3 { from { transform: translateY(-10px) rotate(-1deg); } to { transform: translateY(12px) rotate(1deg); } }
@keyframes breathe { from { opacity: 0.8; } to { opacity: 1; } }
@keyframes shimmer { from { opacity: 0.3; } to { opacity: 0.55; } }
@keyframes par1 { from { transform: translateX(-5px); } to { transform: translateX(5px); } }
@keyframes par2 { from { transform: translateX(-10px); } to { transform: translateX(10px); } }
@keyframes par3 { from { transform: translateX(-18px); } to { transform: translateX(18px); } }
@keyframes fogA { from { transform: translateX(-70px); } to { transform: translateX(70px); } }
@keyframes fogB { from { transform: translateX(90px); } to { transform: translateX(-90px); } }
@keyframes halo { from { transform: scale(0.98); opacity: 0.7; } to { transform: scale(1.03); opacity: 0.9; } }
@keyframes shoot {
  0% { transform: translate(0, 0); opacity: 0; }
  2% { opacity: 1; }
  7% { transform: translate(-520px, 260px); opacity: 0; }
  100% { transform: translate(-520px, 260px); opacity: 0; }
}
</style>
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" class="sky-top"/>
<stop offset="0.55" class="sky-mid"/>
<stop offset="1" class="sky-low"/>
</linearGradient>
<linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" stop-color="#2de2b0" stop-opacity="0"/>
<stop offset="0.35" stop-color="#2de2b0"/>
<stop offset="0.7" stop-color="#5b8cff"/>
<stop offset="1" stop-color="#5b8cff" stop-opacity="0"/>
</linearGradient>
<linearGradient id="g2" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" stop-color="#9b5bff" stop-opacity="0"/>
<stop offset="0.5" stop-color="#9b5bff"/>
<stop offset="1" stop-color="#ff5fa8" stop-opacity="0"/>
</linearGradient>
<linearGradient id="g3" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" stop-color="#36c9ff" stop-opacity="0"/>
<stop offset="0.5" stop-color="#36c9ff"/>
<stop offset="1" stop-color="#2de2b0" stop-opacity="0"/>
</linearGradient>
<linearGradient id="rayG" x1="0" y1="1" x2="0" y2="0">
<stop offset="0" stop-color="#3cf0bd" stop-opacity="0.9"/>
<stop offset="0.4" stop-color="#4fb8ff" stop-opacity="0.5"/>
<stop offset="1" stop-color="#9b5bff" stop-opacity="0"/>
</linearGradient>
<linearGradient id="rayP" x1="0" y1="1" x2="0" y2="0">
<stop offset="0" stop-color="#c06bff" stop-opacity="0.85"/>
<stop offset="0.5" stop-color="#ff6fb3" stop-opacity="0.35"/>
<stop offset="1" stop-color="#ff6fb3" stop-opacity="0"/>
</linearGradient>
<linearGradient id="trail" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" stop-color="#ffffff" stop-opacity="1"/>
<stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
</linearGradient>
<radialGradient id="moonGlow">
<stop offset="0" class="moon-glow" stop-opacity="0.55"/>
<stop offset="1" class="moon-glow" stop-opacity="0"/>
</radialGradient>
<filter id="soft" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="40"/></filter>
<filter id="raysoft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>
<filter id="fogblur" x="-20%" y="-100%" width="140%" height="300%"><feGaussianBlur stdDeviation="30"/></filter>
</defs>

<!-- sky -->
<rect width="1600" height="1000" fill="url(#sky)"/>

<!-- stars in three depths -->
<g class="drift-far">${starLayer(50, 0.9, 'sf', 700)}</g>
<g class="drift-mid">${starLayer(28, 1.4, 'sm', 650)}</g>
<g class="drift-near">${starLayer(10, 1.6, 'sn', 600)}</g>

<!-- shooting stars -->
<g class="shoot"><line x1="1300" y1="90" x2="1420" y2="30" stroke="url(#trail)" stroke-width="2" stroke-linecap="round"/></g>
<g class="shoot k2"><line x1="900" y1="60" x2="1000" y2="10" stroke="url(#trail)" stroke-width="1.6" stroke-linecap="round"/></g>

<!-- moon, pinned to the top right corner -->
<svg x="0" y="0" width="1600" height="1000" viewBox="0 0 1600 1000" preserveAspectRatio="xMaxYMin meet">
<circle class="halo" cx="1450" cy="100" r="85" fill="url(#moonGlow)"/>
<circle class="moon" cx="1450" cy="100" r="22"/>
</svg>

<!-- aurora: soft curtains with shimmering rays -->
<g class="breathe">
<g filter="url(#soft)">
<path class="aur a2" fill="url(#g2)" d="M-100 110 C 300 30, 600 230, 1000 100 S 1500 50, 1700 140 L 1700 230 C 1400 150, 1000 310, 700 210 S 200 140, -100 230 Z"/>
<path class="aur a1" fill="url(#g1)" d="M-100 260 C 250 120, 550 380, 900 220 S 1450 120, 1700 260 L 1700 370 C 1400 250, 1100 430, 800 340 S 200 270, -100 390 Z"/>
<path class="aur a3" fill="url(#g3)" d="M-100 430 C 350 340, 700 530, 1100 410 S 1500 370, 1700 440 L 1700 510 C 1300 450, 1000 570, 600 490 S 150 440, -100 530 Z"/>
</g>
<g class="aur a1" filter="url(#raysoft)">${rays(46, 340, 70, 0.4, 230, 'rayG')}</g>
<g class="aur a2" filter="url(#raysoft)">${rays(34, 200, 55, 2.1, 170, 'rayP')}</g>
</g>

<!-- mountains in three depths, pressed low, with drifting mist between them -->
<g transform="translate(0 1000) scale(1 0.55) translate(0 -1000)">
<g class="p-far"><path class="m-far" d="M-200 820 L 0 760 L 140 800 L 320 700 L 470 780 L 640 720 L 820 790 L 1000 690 L 1180 770 L 1340 710 L 1520 780 L 1800 730 L 1800 1000 L -200 1000 Z"/></g>
<g class="fog1" filter="url(#fogblur)"><ellipse class="fog" cx="500" cy="830" rx="520" ry="40"/><ellipse class="fog" cx="1300" cy="820" rx="460" ry="34"/></g>
<g class="p-mid"><path class="m-mid" d="M-200 880 L 60 820 L 220 870 L 420 790 L 600 860 L 760 820 L 960 880 L 1140 800 L 1320 870 L 1500 820 L 1800 870 L 1800 1000 L -200 1000 Z"/></g>
<g class="fog2" filter="url(#fogblur)"><ellipse class="fog" cx="900" cy="905" rx="640" ry="36"/></g>
<g class="p-near"><path class="m-near" d="M-200 960 L 100 900 L 260 940 L 480 880 L 700 950 L 900 920 L 1120 960 L 1300 890 L 1500 940 L 1800 910 L 1800 1000 L -200 1000 Z"/></g>
</g>
</svg>`
