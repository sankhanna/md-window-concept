// Mock of the Call Sheet app (zillit_web/src/call-sheet/CallSheetApp.jsx).
// Tabs + status badges + day types straight from the real STATUS_UI / TABS constants.
const TABS = ['Drafts', 'Approvals', 'Published Call sheet', 'Permission']

const STATUS = {
  DRAFT: { label: 'Draft', cls: 'st-gray' },
  FOR_COMMENTS: { label: 'For Comments', cls: 'st-orange' },
  PENDING_SIGN: { label: 'Pending Signature', cls: 'st-blue' },
  FINAL_APPROVED: { label: 'Final Approved', cls: 'st-green' },
  PUBLISHED: { label: 'Published', cls: 'st-orange' },
}

const SHEETS = [
  { title: 'Day 14 — INT. Old Mill', unit: 'Main Unit', day: 'SWD', date: 'Mon 29 Jun', status: 'PUBLISHED' },
  { title: 'Day 15 — EXT. Riverside', unit: 'Main Unit', day: 'CWD', date: 'Tue 30 Jun', status: 'PENDING_SIGN' },
  { title: 'Day 16 — Splinter Unit', unit: '2nd Unit', day: 'SCWD', date: 'Wed 01 Jul', status: 'FOR_COMMENTS' },
  { title: 'Day 17 — INT. Warehouse', unit: 'Main Unit', day: 'SWD', date: 'Thu 02 Jul', status: 'DRAFT' },
]

export default function CallSheet() {
  return (
    <div className="mod mod-callsheet">
      <div className="mod-tabs">
        {TABS.map((t, i) => (
          <button key={t} className={`mod-tab ${i === 0 ? 'mod-tab--active' : ''}`}>{t}</button>
        ))}
      </div>
      <div className="mod-scroll">
        <table className="cs-table">
          <thead>
            <tr><th>Call sheet</th><th>Unit</th><th>Day</th><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {SHEETS.map((s, i) => {
              const st = STATUS[s.status]
              return (
                <tr key={i}>
                  <td className="cs-title">{s.title}</td>
                  <td>{s.unit}</td>
                  <td><span className="cs-day">{s.day}</span></td>
                  <td>{s.date}</td>
                  <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="mod-actions">
        <button className="btn btn--ghost">Add Section</button>
        <button className="btn">Send for Approval</button>
      </div>
    </div>
  )
}
