import { useRef } from 'react'
import { MODULES } from '../../config.js'
import ModuleContent from '../../modules/registry.jsx'

// A single MDI child window: draggable by its title bar, resizable from the
// bottom-right grip, focus-on-click (z-index bump), minimize / maximize / close,
// and a ⤢ that detaches it into a real OS window (the earlier pop-out behaviour).
export default function MdiWindow({ win, session, onFocus, onChange, onClose, onMinimize, onToggleMax, onPopOut }) {
  const mod = MODULES.find((m) => m.key === win.key) || { label: win.key, icon: '🔲' }
  const gesture = useRef(null)

  const startDrag = (e) => {
    if (win.maximized) return
    onFocus(win.id)
    gesture.current = { type: 'drag', sx: e.clientX, sy: e.clientY, ox: win.x, oy: win.y }
    attach()
  }

  const startResize = (e) => {
    e.stopPropagation()
    onFocus(win.id)
    gesture.current = { type: 'resize', sx: e.clientX, sy: e.clientY, ow: win.w, oh: win.h }
    attach()
  }

  const attach = () => {
    const move = (ev) => {
      const g = gesture.current
      if (!g) return
      if (g.type === 'drag') {
        onChange(win.id, { x: Math.max(0, g.ox + ev.clientX - g.sx), y: Math.max(0, g.oy + ev.clientY - g.sy) })
      } else {
        onChange(win.id, { w: Math.max(320, g.ow + ev.clientX - g.sx), h: Math.max(220, g.oh + ev.clientY - g.sy) })
      }
    }
    const up = () => {
      gesture.current = null
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }

  const style = win.maximized
    ? { inset: '8px', width: 'auto', height: 'auto', zIndex: win.z }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z }

  return (
    <div
      className={`mdi ${win.focused ? 'mdi--focused' : ''}`}
      style={style}
      onMouseDown={() => onFocus(win.id)}
    >
      <div className="mdi__bar" onMouseDown={startDrag} onDoubleClick={() => onToggleMax(win.id)}>
        <span className="mdi__title">
          <span className="mdi__icon">{mod.icon}</span> {mod.label}
        </span>
        <span className="mdi__controls">
          <button title="Pop out to OS window" onClick={(e) => { e.stopPropagation(); onPopOut(win.key) }}>⤢</button>
          <button title="Minimize" onClick={(e) => { e.stopPropagation(); onMinimize(win.id) }}>—</button>
          <button title={win.maximized ? 'Restore' : 'Maximize'} onClick={(e) => { e.stopPropagation(); onToggleMax(win.id) }}>▢</button>
          <button className="mdi__close" title="Close" onClick={(e) => { e.stopPropagation(); onClose(win.id) }}>✕</button>
        </span>
      </div>
      <div className="mdi__body">
        <ModuleContent moduleKey={win.key} session={session} />
      </div>
      {!win.maximized && <div className="mdi__grip" onMouseDown={startResize} />}
    </div>
  )
}
