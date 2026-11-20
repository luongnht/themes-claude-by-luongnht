import type { ThemeSetArgs } from 'claude-code'

import { AURORA } from './aurora'
import { makeColors } from './make-colors.js'
import { DUSK, OCEAN, PINES, SYNTH } from './pixel'
import { AUTUMN, CITY, SAKURA, SKY, SPACE } from './pixel2'

export type Look = {
  id: string
  name: string
  hint: string
  scene: string
  alt: string
  // The light the pointer leaves behind, 0 to 1 each.
  tint: { r: number; g: number; b: number }
  args: ThemeSetArgs
  problems: string[]
}

type Anchors = {
  'surface-0': string
  'surface-1': string
  'surface-2': string
  'surface-3'?: string
  'text-primary': string
  'text-secondary': string
  'text-muted': string
}

const look = (
  id: string,
  name: string,
  hint: string,
  scene: string,
  alt: string,
  tint: Look['tint'],
  roles: Record<'accent' | 'danger' | 'success' | 'warning' | 'pro', string>,
  light: Anchors | undefined,
  dark: Anchors,
): Look => {
  const { theme, problems } = makeColors({
    label: name,
    roles,
    ...(light === undefined ? { only: 'dark' as const } : { light: { gray: { anchors: light } } }),
    dark: { gray: { anchors: dark } },
  })

  return {
    id,
    name,
    hint,
    scene,
    alt,
    tint,
    problems,
    args: { colors: theme, backdrop: { scene: id, glass: { blur: 24, opacity: 0.7 } } },
  }
}

export const LOOKS: Look[] = [
  look(
    'hoang-hon',
    'Hoàng hôn halftone',
    'mặt trời bằng chấm lặn ở góc, mây chấm trôi',
    DUSK,
    'Mặt trời halftone lặn sau đồi, mây chấm trôi chậm',
    { r: 1, g: 0.55, b: 0.25 },
    { accent: '#e8743b', danger: '#d6404e', success: '#3f9e6e', warning: '#d99a1e', pro: '#8a5fd1' },
    {
      'surface-0': '#f1e7d6',
      'surface-1': '#f6eee1',
      'surface-2': '#fbf6ee',
      'text-primary': '#231b2e',
      'text-secondary': '#4c4258',
      'text-muted': '#62586c',
    },
    {
      'surface-0': '#121630',
      'surface-1': '#191d3a',
      'surface-2': '#1f2443',
      'surface-3': '#252a4a',
      'text-primary': '#f1ecf6',
      'text-secondary': '#cbc4d8',
      'text-muted': '#a9a2b8',
    },
  ),
  look(
    'rung-thong',
    'Rừng thông tuyết',
    'thông pixel hai bên, tuyết rơi hai lớp, trăng pixel',
    PINES,
    'Rừng thông pixel dưới trăng, tuyết rơi',
    { r: 0.8, g: 0.93, b: 1 },
    { accent: '#3f9e8a', danger: '#d5484f', success: '#4c9a4a', warning: '#d39b2a', pro: '#7b6bd6' },
    {
      'surface-0': '#e6edf0',
      'surface-1': '#eef3f5',
      'surface-2': '#f6f9fa',
      'text-primary': '#17242a',
      'text-secondary': '#3e5058',
      'text-muted': '#55666e',
    },
    {
      'surface-0': '#0d1620',
      'surface-1': '#132029',
      'surface-2': '#192832',
      'surface-3': '#1e2f3a',
      'text-primary': '#e8f1f4',
      'text-secondary': '#c0ced4',
      'text-muted': '#9cadb5',
    },
  ),
  look(
    'synthwave',
    'Synthwave',
    'mặt trời sọc pixel, lưới neon lăn tới, chỉ có chế độ tối',
    SYNTH,
    'Mặt trời sọc neon trên lưới phát sáng đang lăn tới',
    { r: 1, g: 0.35, b: 0.7 },
    { accent: '#ff4fa3', danger: '#ff5470', success: '#3fdc9a', warning: '#ffb23f', pro: '#9d6bff' },
    undefined,
    {
      'surface-0': '#120b26',
      'surface-1': '#1a1033',
      'surface-2': '#21153e',
      'surface-3': '#271a47',
      'text-primary': '#f6eaff',
      'text-secondary': '#d3c2ea',
      'text-muted': '#ad9cc6',
    },
  ),
  look(
    'dai-duong',
    'Đại dương',
    'rùa biển pixel bơi ngang, bầy cá, bong bóng, tia nắng',
    OCEAN,
    'Rùa biển pixel bơi qua làn nước, bong bóng nổi lên',
    { r: 0.4, g: 1, b: 0.9 },
    { accent: '#1fa3b8', danger: '#e0505a', success: '#2fa36e', warning: '#e0a12a', pro: '#7a6cf0' },
    {
      'surface-0': '#e2f1f2',
      'surface-1': '#ebf6f7',
      'surface-2': '#f4fbfb',
      'text-primary': '#122a30',
      'text-secondary': '#38545b',
      'text-muted': '#4e6a70',
    },
    {
      'surface-0': '#071a24',
      'surface-1': '#0c222e',
      'surface-2': '#112a38',
      'surface-3': '#163242',
      'text-primary': '#e6f6f8',
      'text-secondary': '#bfd8dc',
      'text-muted': '#98b6bc',
    },
  ),
  look(
    'cuc-quang',
    'Cực quang',
    'cực quang nhiều lớp, núi, sương, sao băng',
    AURORA,
    'Cực quang nhiều lớp trên dãy núi, sao băng và trăng sáng',
    { r: 0.3, g: 1, b: 0.75 },
    { accent: '#7c4dff', danger: '#e0445a', success: '#1fa37a', warning: '#e09a1a', pro: '#c04fd8' },
    {
      'surface-0': '#ece8f6',
      'surface-1': '#f3f0fa',
      'surface-2': '#f9f7fd',
      'text-primary': '#1f1a33',
      'text-secondary': '#4a4366',
      'text-muted': '#5f587a',
    },
    {
      'surface-0': '#0f1022',
      'surface-1': '#16182e',
      'surface-2': '#1d2039',
      'surface-3': '#232641',
      'text-primary': '#eef0ff',
      'text-secondary': '#c6c9e6',
      'text-muted': '#a3a7c8',
    },
  ),
  look(
    'bau-troi',
    'Trời xanh mây trắng',
    'mây pixel trôi chậm, đàn chim nhỏ bay ngang; tối là chạng vạng hồng',
    SKY,
    'Trời xanh với mây pixel trôi chậm và đàn chim nhỏ',
    { r: 0.2, g: 0.55, b: 1 },
    { accent: '#2f8fd6', danger: '#d6455a', success: '#3a9a5c', warning: '#d9961f', pro: '#7a62d6' },
    {
      'surface-0': '#e4f0f7',
      'surface-1': '#edf5fa',
      'surface-2': '#f6fafd',
      'text-primary': '#13253a',
      'text-secondary': '#3b4f63',
      'text-muted': '#52667a',
    },
    {
      'surface-0': '#141631',
      'surface-1': '#1b1d3b',
      'surface-2': '#222545',
      'surface-3': '#28294d',
      'text-primary': '#f0edfa',
      'text-secondary': '#cbc6de',
      'text-muted': '#a8a3bf',
    },
  ),
  look(
    'thanh-pho',
    'Thành phố đêm mưa',
    'nhà cao tầng hai bên, cửa sổ sáng đèn, mưa thưa',
    CITY,
    'Thành phố pixel trong mưa, cửa sổ sáng đèn',
    { r: 1, g: 0.8, b: 0.35 },
    { accent: '#e3a72f', danger: '#e0525a', success: '#3fa47a', warning: '#e0a12a', pro: '#7d7ce0' },
    {
      'surface-0': '#e3e7eb',
      'surface-1': '#ebeef1',
      'surface-2': '#f4f6f8',
      'text-primary': '#161d26',
      'text-secondary': '#3c4652',
      'text-muted': '#535e6a',
    },
    {
      'surface-0': '#0d1220',
      'surface-1': '#131929',
      'surface-2': '#192032',
      'surface-3': '#1e263a',
      'text-primary': '#edf0f6',
      'text-secondary': '#c4cad6',
      'text-muted': '#a0a7b5',
    },
  ),
  look(
    'hoa-anh-dao',
    'Hoa anh đào',
    'cành hoa ở hai góc trên, cánh hoa rơi; tối có trăng',
    SAKURA,
    'Cành hoa anh đào pixel, cánh hoa rơi chậm',
    { r: 1, g: 0.55, b: 0.75 },
    { accent: '#d9578a', danger: '#d33f4f', success: '#3f9a6a', warning: '#d4962a', pro: '#8a5fd1' },
    {
      'surface-0': '#f8e9ee',
      'surface-1': '#fbf0f3',
      'surface-2': '#fdf7f9',
      'text-primary': '#2a1a24',
      'text-secondary': '#55404d',
      'text-muted': '#6b5562',
    },
    {
      'surface-0': '#1a1830',
      'surface-1': '#211e39',
      'surface-2': '#282442',
      'surface-3': '#2e2a4a',
      'text-primary': '#f6ecf3',
      'text-secondary': '#d6c6d2',
      'text-muted': '#b4a4b2',
    },
  ),
  look(
    'mua-thu',
    'Mùa thu lá rơi',
    'cây tròn ở góc, đồi ấm, lá phong pixel rơi',
    AUTUMN,
    'Đồi mùa thu với cây pixel và lá rơi',
    { r: 1, g: 0.55, b: 0.2 },
    { accent: '#d0642a', danger: '#c43c3c', success: '#5a8f3a', warning: '#c98a1a', pro: '#8a5aa8' },
    {
      'surface-0': '#f4e6d2',
      'surface-1': '#f8eedf',
      'surface-2': '#fcf7ef',
      'text-primary': '#2b1d14',
      'text-secondary': '#58463a',
      'text-muted': '#6e5b4d',
    },
    {
      'surface-0': '#1f1517',
      'surface-1': '#271b1c',
      'surface-2': '#2f2122',
      'surface-3': '#362728',
      'text-primary': '#f5ebe2',
      'text-secondary': '#d6c6b8',
      'text-muted': '#b5a596',
    },
  ),
  look(
    'vu-tru',
    'Vũ trụ',
    'hành tinh có vành ở góc, mặt trăng nhỏ, sao chổi thưa; chỉ có chế độ tối',
    SPACE,
    'Hành tinh có vành và sao chổi giữa vũ trụ pixel',
    { r: 0.6, g: 0.5, b: 1 },
    { accent: '#8b7bff', danger: '#ff5b6e', success: '#3fd19a', warning: '#ffb547', pro: '#d16bff' },
    undefined,
    {
      'surface-0': '#0b0920',
      'surface-1': '#120f2b',
      'surface-2': '#181434',
      'surface-3': '#1d183c',
      'text-primary': '#efeaff',
      'text-secondary': '#cbc3e6',
      'text-muted': '#a79fc4',
    },
  ),
]

export const DEFAULT_LOOK = 'hoang-hon'

export const findLook = (query: string): Look | undefined => {
  // Brackets and quotes typed from the hint are not part of the name.
  const q = query.replace(/[<>"'`[\]]/g, '').trim().toLowerCase()
  const index = Number(q)

  if (q !== '' && Number.isInteger(index)) {
    return LOOKS[index - 1]
  }

  return LOOKS.find(one => one.id === q) ?? LOOKS.find(one => one.id.includes(q) || one.name.toLowerCase().includes(q))
}
