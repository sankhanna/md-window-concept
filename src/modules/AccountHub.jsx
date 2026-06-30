// Account Hub — production accounting dashboard (mirrors the Accounts film tool).
const SUMMARY = [
  { label: 'Total Budget', value: '₹ 4.20 Cr' },
  { label: 'Committed', value: '₹ 1.86 Cr' },
  { label: 'Spent', value: '₹ 1.12 Cr' },
  { label: 'Remaining', value: '₹ 3.08 Cr', good: true },
]

const COST_CENTERS = [
  { code: '1100', name: 'Cast', budget: '₹ 95.0 L', actual: '₹ 41.2 L', status: 'OPEN' },
  { code: '2200', name: 'Camera & Lighting', budget: '₹ 62.0 L', actual: '₹ 48.7 L', status: 'OPEN' },
  { code: '3300', name: 'Art & Set', budget: '₹ 58.5 L', actual: '₹ 60.1 L', status: 'OVER' },
  { code: '4400', name: 'Locations', budget: '₹ 30.0 L', actual: '₹ 12.4 L', status: 'OPEN' },
  { code: '5500', name: 'Post Production', budget: '₹ 44.0 L', actual: '₹ 0.0 L', status: 'HOLD' },
]

const ST = { OPEN: 'st-green', OVER: 'st-orange', HOLD: 'st-gray' }

export default function AccountHub() {
  return (
    <div className="mod mod-account">
      <div className="mod-scroll">
        <div className="acc-cards">
          {SUMMARY.map((s) => (
            <div key={s.label} className="acc-card">
              <div className="acc-card__label">{s.label}</div>
              <div className={`acc-card__value ${s.good ? 'acc-card__value--good' : ''}`}>{s.value}</div>
            </div>
          ))}
        </div>
        <div className="acc-section">Cost Centers</div>
        <table className="cs-table">
          <thead>
            <tr><th>Code</th><th>Cost Center</th><th>Budget</th><th>Actual</th><th>Status</th></tr>
          </thead>
          <tbody>
            {COST_CENTERS.map((c) => (
              <tr key={c.code}>
                <td>{c.code}</td>
                <td className="cs-title">{c.name}</td>
                <td>{c.budget}</td>
                <td>{c.actual}</td>
                <td><span className={`badge ${ST[c.status]}`}>{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mod-actions">
        <button className="btn btn--ghost">Export</button>
        <button className="btn">New Entry</button>
      </div>
    </div>
  )
}
