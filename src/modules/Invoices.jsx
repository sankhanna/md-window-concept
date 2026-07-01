// Invoices / Accounts Payable — vendor invoice register.
const TABS = ['All', 'Pending Approval', 'Paid', 'Overdue']
const inr = (n) => `₹ ${Number(n).toLocaleString('en-IN')}`

const INVOICES = [
  { no: 'INV-8841', vendor: 'GreenSet Builders', po: 'PO-2041', amount: 840000, due: '10 Jul', status: 'PENDING' },
  { no: 'INV-8840', vendor: 'CineRent Camera', po: 'PO-2040', amount: 1275000, due: '05 Jul', status: 'PAID' },
  { no: 'INV-8839', vendor: 'Spotboy Catering', po: 'PO-2039', amount: 195000, due: '28 Jun', status: 'OVERDUE' },
  { no: 'INV-8838', vendor: 'Apex Transport', po: 'PO-2038', amount: 310000, due: '12 Jul', status: 'PENDING' },
]
const ST = { PENDING: { c: 'st-orange', t: 'Pending' }, PAID: { c: 'st-green', t: 'Paid' }, OVERDUE: { c: 'st-red', t: 'Overdue' } }

export default function Invoices() {
  return (
    <div className="mod mod-invoices">
      <div className="mod-tabs">
        {TABS.map((t, i) => <button key={t} className={`mod-tab ${i === 0 ? 'mod-tab--active' : ''}`}>{t}</button>)}
      </div>
      <div className="mod-scroll">
        <table className="cs-table">
          <thead>
            <tr><th>Invoice #</th><th>Vendor</th><th>PO #</th><th className="num">Amount</th><th>Due</th><th>Status</th></tr>
          </thead>
          <tbody>
            {INVOICES.map((v) => (
              <tr key={v.no}>
                <td className="cs-title">{v.no}</td>
                <td>{v.vendor}</td>
                <td>{v.po}</td>
                <td className="num">{inr(v.amount)}</td>
                <td>{v.due}</td>
                <td><span className={`badge ${ST[v.status].c}`}>{ST[v.status].t}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mod-actions">
        <button className="btn btn--ghost">Export</button>
        <button className="btn">New Invoice</button>
      </div>
    </div>
  )
}
