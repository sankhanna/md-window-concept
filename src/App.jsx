import { useState } from 'react'
import { MENU, MODULE_META } from './config.js'
import { useWindowSession } from './useWindowSession.js'
import ModuleContent from './modules/registry.jsx'
import MdiWindow from './components/mdi/MdiWindow.jsx'
import { useMdi } from './components/mdi/useMdi.js'

// A pop-out window carries ?module=<key>; it renders only that module.
function getModuleParam() {
  return new URLSearchParams(location.search).get('module')
}

export default function App() {
  const session = useWindowSession()
  const popModule = getModuleParam()

  // Pop-out window: render just the one module, standalone.
  if (popModule) {
    return (
      <div className="popout popout--mod">
        <ModuleContent moduleKey={popModule} session={session} />
      </div>
    )
  }

  // Shell window: sidebar + main pane, with pop-out buttons.
  return <Shell session={session} />
}

function Shell({ session }) {
  const mdi = useMdi()
  const [toast, setToast] = useState(null)
  const [collapsed, setCollapsed] = useState(false)
  const openKeys = new Set(mdi.wins.map((w) => w.key))
  const visible = mdi.wins.filter((w) => !w.minimized)
  const activeKey = mdi.wins.find((w) => w.focused && !w.minimized)?.key

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200) }
  const runAction = (action) => {
    if (action === 'pin') flash('Pinned to Start')
    else if (action === 'logout') flash('Logout (prototype — session kept)')
  }

  return (
    <div className={`shell ${collapsed ? 'shell--collapsed' : ''}`}>
      <aside className="sidebar">
        <button
          className="sidebar__toggle"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expand menu' : 'Collapse menu'}
        >
          {collapsed ? '›' : '‹'}
        </button>
        <div className="brand"><span className="brand__logo">{collapsed ? 'Z' : 'Zillit'}</span></div>
        <nav>
          {MENU.map((item) => {
            const meta = MODULE_META[item.key] || item
            const isOpen = !item.action && openKeys.has(item.key)
            const isActive = !item.action && item.key === activeKey
            return (
              <div key={item.key} className={`navrow ${isActive ? 'navrow--active' : isOpen ? 'navrow--open' : ''} ${item.key === 'logout' ? 'navrow--logout' : ''}`}>
                <button
                  className="navrow__main"
                  title={meta.label}
                  onClick={() => (item.action ? runAction(item.action) : mdi.open(item.key))}
                >
                  <span className="navrow__icon">{meta.icon}</span>
                  <span className="navrow__label">{meta.label}</span>
                  {item.badge && <span className="navrow__badge">{item.badge}</span>}
                </button>
              </div>
            )
          })}
        </nav>
        <div className="sidebar__foot">
          Content items open as <strong>MDI child windows</strong> (drag, resize, double-click to
          maximize; open several at once). All windows share one socket.
        </div>
      </aside>

      <main className="workspace">
        <div className="workspace__toolbar">
          <span className="workspace__count">{mdi.wins.length} open</span>
          {mdi.wins.length > 0 && (
            <div className="toolbar__windows">
              {(() => {
                // a chip per OPEN window (maximized ones included). Duplicate
                // instances of a module get a numeric suffix so they're tellable.
                const counts = {}
                mdi.wins.forEach((w) => { counts[w.key] = (counts[w.key] || 0) + 1 })
                const seen = {}
                return mdi.wins.map((w) => {
                  const mod = MODULE_META[w.key]
                  seen[w.key] = (seen[w.key] || 0) + 1
                  const label = `${mod?.label}${counts[w.key] > 1 ? ` ${seen[w.key]}` : ''}`
                  return (
                    <div
                      key={w.id}
                      className={`taskbar__item ${w.focused ? 'taskbar__item--active' : ''} ${w.minimized ? 'taskbar__item--min' : ''}`}
                    >
                      <button
                        className="taskbar__item-main"
                        title={w.minimized ? `${label} (minimized) — click to restore` : `${label} — click to bring to front`}
                        onClick={() => mdi.restore(w.id)}
                      >
                        <span>{mod?.icon}</span> {label}
                      </button>
                      <button
                        className="taskbar__close"
                        title={`Close ${label}`}
                        onClick={(e) => { e.stopPropagation(); mdi.close(w.id) }}
                      >
                        ✕
                      </button>
                    </div>
                  )
                })
              })()}
            </div>
          )}
          <div className="toolbar__actions">
            <button className="btn btn--ghost" onClick={mdi.cascade} disabled={!mdi.wins.length}>Cascade</button>
            <button className="btn btn--ghost" onClick={mdi.closeAll} disabled={!mdi.wins.length}>Close all</button>
          </div>
        </div>

        <div className="workspace__canvas">
          {mdi.wins.length === 0 && (
            <div className="workspace__empty">Pick a module from the sidebar to open a window.</div>
          )}
          {visible.map((w) => (
            <MdiWindow
              key={w.id}
              win={w}
              session={session}
              onFocus={mdi.focus}
              onChange={mdi.change}
              onClose={mdi.close}
              onMinimize={mdi.minimize}
              onToggleMax={mdi.toggleMax}
              openModule={mdi.open}
            />
          ))}
        </div>
      </main>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
