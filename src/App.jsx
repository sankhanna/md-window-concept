import { MODULES } from './config.js'
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
  const openKeys = new Set(mdi.wins.map((w) => w.key))
  const visible = mdi.wins.filter((w) => !w.minimized)

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">Zillit</div>
        <nav>
          {MODULES.map((m) => (
            <div key={m.key} className={`navrow ${openKeys.has(m.key) ? 'navrow--open' : ''}`}>
              <button className="navrow__main" onClick={() => mdi.open(m.key)}>
                <span className="navrow__icon">{m.icon}</span>
                {m.label}
              </button>
            </div>
          ))}
        </nav>
        <div className="sidebar__foot">
          Each click opens a <strong>new MDI child window</strong> — open the same module many
          times. Drag the title bar, resize from the corner, double-click to maximize. All windows
          share one socket.
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
                  const mod = MODULES.find((m) => m.key === w.key)
                  seen[w.key] = (seen[w.key] || 0) + 1
                  const label = `${mod?.label}${counts[w.key] > 1 ? ` ${seen[w.key]}` : ''}`
                  return (
                    <button
                      key={w.id}
                      className={`taskbar__item ${w.focused ? 'taskbar__item--active' : ''} ${w.minimized ? 'taskbar__item--min' : ''}`}
                      title={w.minimized ? `${label} (minimized) — click to restore` : `${label} — click to bring to front`}
                      onClick={() => mdi.restore(w.id)}
                    >
                      <span>{mod?.icon}</span> {label}
                    </button>
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
            />
          ))}
        </div>
      </main>
    </div>
  )
}
