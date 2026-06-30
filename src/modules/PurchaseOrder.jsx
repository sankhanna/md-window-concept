// Purchase Order — PO register (mirrors the Purchase Order film tool).
const TABS = ['All', 'Pending', 'Approved', 'Closed']

const POS = [
  { no: 'PO-2041', vendor: 'GreenSet Builders', dept: 'Art & Set', amount: '₹ 8,40,000', status: 'PENDING' },
  { no: 'PO-2040', vendor: 'CineRent Camera', dept: 'Camera', amount: '₹ 12,75,000', status: 'APPROVED' },
  { no: 'PO-2039', vendor: 'Spotboy Catering', dept: 'Production', amount: '₹ 1,95,000', status: 'APPROVED' },
  { no: 'PO-2038', vendor: 'Apex Transport', dept: 'Transport', amount: '₹ 3,10,000', status: 'CLOSED' },
  { no: 'PO-2037', vendor: 'Lumière Lighting', dept: 'Lighting', amount: '₹ 5,60,000', status: 'PENDING' },
]

const ST = { PENDING: { c: 'st-orange', t: 'Pending' }, APPROVED: { c: 'st-green', t: 'Approved' }, CLOSED: { c: 'st-gray', t: 'Closed' } }

export default function PurchaseOrder() {
  return (
    <div className="mod mod-po">
      <div className="mod-tabs">
        {TABS.map((t, i) => <button key={t} className={`mod-tab ${i === 0 ? 'mod-tab--active' : ''}`}>{t}</button>)}
      </div>
      <div className="mod-scroll">
        <table className="cs-table">
          <thead>
            <tr><th>PO #</th><th>Vendor</th><th>Department</th><th className="num">Amount</th><th>Status</th></tr>
          </thead>
          <tbody>
            {POS.map((p) => (
              <tr key={p.no}>
                <td className="cs-title">{p.no}</td>
                <td>{p.vendor}</td>
                <td>{p.dept}</td>
                <td className="num">{p.amount}</td>
                <td><span className={`badge ${ST[p.status].c}`}>{ST[p.status].t}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mod-actions">
        <button className="btn btn--ghost">Export</button>
        <button className="btn">Raise PO</button>
      </div>
    </div>
  )
}
