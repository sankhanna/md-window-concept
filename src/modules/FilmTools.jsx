import { TOOLS } from '../config.js'

// Tools grid (zillit_web/src/pages/FilmTools/FilmTools.jsx). Every card opens its
// module in an MDI window (open-or-focus). Tool list is the single source of
// truth in config.js so titles/registry stay in sync.
export default function FilmTools({ openModule }) {
  return (
    <div className="mod mod-tools">
      <div className="tools__bar">
        <input className="tools__search" placeholder="Search tools..." />
      </div>
      <div className="mod-scroll">
        <div className="tools__grid">
          {TOOLS.map((t) => (
            <button
              key={t.key}
              className="toolcard toolcard--live"
              onClick={() => openModule?.(t.key)}
              title={`Open ${t.label}`}
            >
              <span className="toolcard__icon">{t.icon}</span>
              <span className="toolcard__name">{t.label}</span>
              {t.count > 0 && <span className="toolcard__badge">{t.count}</span>}
              <span className="toolcard__info">i</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
