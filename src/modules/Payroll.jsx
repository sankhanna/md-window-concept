// Payroll — weekly crew payroll register (mirrors the Payroll film tool).
const SUMMARY = [
  { label: 'Period', value: 'Week 24 · 22–28 Jun' },
  { label: 'Headcount', value: '86' },
  { label: 'Gross', value: '₹ 38.4 L' },
  { label: 'Net Payable', value: '₹ 31.7 L', good: true },
]

const ROWS = [
  { name: 'Anjali Sharma', dept: 'Camera', gross: '₹ 5,25,000', net: '₹ 4,33,000', status: 'PAID' },
  { name: 'Imran Qureshi', dept: 'Lighting', gross: '₹ 1,26,000', net: '₹ 1,07,000', status: 'PROCESSING' },
  { name: 'Meera Nair', dept: 'Costume', gross: '₹ 1,54,000', net: '₹ 1,29,000', status: 'PAID' },
  { name: 'Rahul Dev', dept: 'Sound', gross: '₹ 1,15,500', net: '₹ 98,000', status: 'HOLD' },
  { name: 'Background Crew (42)', dept: 'Production', gross: '₹ 6,30,000', net: '₹ 5,67,000', status: 'PROCESSING' },
]

const ST = { PAID: { c: 'st-green', t: 'Paid' }, PROCESSING: { c: 'st-blue', t: 'Processing' }, HOLD: { c: 'st-gray', t: 'On Hold' } }

export default function Payroll() {
  return (
    <div className="mod mod-payroll">
      <div className="mod-scroll">
        <div className="acc-cards">
          {SUMMARY.map((s) => (
            <div key={s.label} className="acc-card">
              <div className="acc-card__label">{s.label}</div>
              <div className={`acc-card__value ${s.good ? 'acc-card__value--good' : ''}`}>{s.value}</div>
            </div>
          ))}
        </div>
        <div className="acc-section">Crew Payroll</div>
        <table className="cs-table">
          <thead>
            <tr><th>Crew Member</th><th>Department</th><th className="num">Gross</th><th className="num">Net</th><th>Status</th></tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.name}>
                <td className="cs-title">{r.name}</td>
                <td>{r.dept}</td>
                <td className="num">{r.gross}</td>
                <td className="num">{r.net}</td>
                <td><span className={`badge ${ST[r.status].c}`}>{ST[r.status].t}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mod-actions">
        <button className="btn btn--ghost">Payslips</button>
        <button className="btn">Run Payroll</button>
      </div>
    </div>
  )
}
