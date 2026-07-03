import { useState, useCallback } from 'react'

// Tiny MDI window-manager. Each window has a unique `id` (instance) and a `key`
// (the module it renders) — so the SAME module can be opened in many windows at
// once. Every open() spawns a fresh window. z-order is derived from the current
// windows inside each updater so batched opens/focuses can't read a stale value.
const DEFAULT_W = 520
const DEFAULT_H = 420

const nextZ = (ws) => ws.reduce((m, w) => Math.max(m, w.z), 10) + 1
const newId = () => `w-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

export function useMdi() {
  const [wins, setWins] = useState([]) // [{id,key,x,y,w,h,z,minimized,maximized,focused}]

  const focus = useCallback((id) => {
    setWins((ws) => {
      if (!ws.some((w) => w.id === id)) return ws
      const z = nextZ(ws)
      return ws.map((w) => ({ ...w, z: w.id === id ? z : w.z, focused: w.id === id }))
    })
  }, [])

  // Open-or-focus: if a window for this module is already open, bring it to the
  // front (restoring it if minimized) instead of opening a duplicate. Only opens
  // a new window when none exists for the module.
  const open = useCallback((key) => {
    setWins((ws) => {
      const z = nextZ(ws)
      const existing = ws.find((w) => w.key === key)
      if (existing) {
        return ws.map((w) => ({
          ...w,
          z: w.id === existing.id ? z : w.z,
          minimized: w.id === existing.id ? false : w.minimized,
          focused: w.id === existing.id,
        }))
      }
      const offset = (ws.length % 6) * 28
      return [
        ...ws.map((w) => ({ ...w, focused: false })),
        // open expanded; stored x/y/w/h is the size it restores to via ▢
        { id: newId(), key, x: 28 + offset, y: 24 + offset, w: DEFAULT_W, h: DEFAULT_H, z, minimized: false, maximized: true, focused: true },
      ]
    })
  }, [])

  const change = useCallback((id, patch) => {
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, ...patch } : w)))
  }, [])

  const close = useCallback((id) => setWins((ws) => ws.filter((w) => w.id !== id)), [])
  const minimize = useCallback((id) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, minimized: true, focused: false } : w))), [])
  const restore = useCallback((id) => setWins((ws) => {
    const z = nextZ(ws)
    return ws.map((w) => ({ ...w, z: w.id === id ? z : w.z, minimized: w.id === id ? false : w.minimized, focused: w.id === id }))
  }), [])
  const toggleMax = useCallback((id) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w))), [])

  const cascade = useCallback(() => {
    setWins((ws) => ws.map((w, i) => ({ ...w, x: 28 + (i % 6) * 28, y: 24 + (i % 6) * 28, minimized: false, maximized: false })))
  }, [])
  const closeAll = useCallback(() => setWins([]), [])

  return { wins, open, focus, change, close, minimize, restore, toggleMax, cascade, closeAll }
}
