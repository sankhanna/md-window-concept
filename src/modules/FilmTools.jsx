// Mock of the Film Tools grid (zillit_web/src/pages/FilmTools/FilmTools.jsx).
// Tool names taken from the real sectionList, sorted alphabetically as the app does.
const TOOLS = [
  { name: 'Accounts', count: 0 },
  { name: 'Asset Report', count: 3 },
  { name: 'Background Casting', count: 0 },
  { name: 'Background Wardrobe', count: 0 },
  { name: 'Catering', count: 1 },
  { name: 'Confidential Info', count: 0 },
  { name: 'Continuity', count: 5 },
  { name: 'Department Budget', count: 0 },
  { name: 'Forms & Signature', count: 2 },
  { name: 'Full Budget', count: 0 },
  { name: 'Generate Crew List', count: 0 },
  { name: 'Info', count: 0 },
  { name: 'Location', count: 4 },
  { name: 'Main Casting', count: 0 },
  { name: 'Main Wardrobe', count: 0 },
  { name: 'Permission Grid', count: 0 },
  { name: 'Pre-Production Calendar', count: 0 },
  { name: 'Production Calendar', count: 1 },
  { name: 'Purchase Order', count: 7 },
  { name: 'Schedule Distribution', count: 0 },
  { name: 'Script Distribution', count: 0 },
  { name: 'Script Notes', count: 0 },
  { name: 'Transportation', count: 2 },
  { name: 'Wardrobe', count: 0 },
  { name: 'Weather', count: 0 },
]

export default function FilmTools() {
  return (
    <div className="mod mod-tools">
      <div className="tools__bar">
        <input className="tools__search" placeholder="Search tools..." />
      </div>
      <div className="mod-scroll">
        <div className="tools__grid">
          {TOOLS.map((t) => (
            <button key={t.name} className="toolcard">
              <span className="toolcard__name">{t.name}</span>
              {t.count > 0 && <span className="toolcard__badge">{t.count}</span>}
              <span className="toolcard__info">i</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
