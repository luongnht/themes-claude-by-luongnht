export type Burst = {
  id: number
  kind: 'small' | 'commit' | 'merge' | 'click'
  // Where a click landed, 0 to 1 across and down the backdrop.
  x: number
  y: number
}

declare module 'claude-code' {
  interface PluginState {
    'phong-canh': { burst: Shaped<Burst | null> }
  }
}
