// Production Cards — company/production card register (P-cards).
const inr = (n) => `₹ ${Number(n).toLocaleString('en-IN')}`

const CARDS = [
  { holder: 'Priya Menon', role: '1st AD', last4: '4471', limit: 500000, spent: 218400, status: 'ACTIVE' },
  { holder: 'Rohit Verma', role: 'Line Producer', last4: '8820', limit: 1000000, spent: 642000, status: 'ACTIVE' },
  { holder: 'Meera Nair', role: 'Costume', last4: '3155', limit: 300000, spent: 301200, status: 'OVER' },
  { holder: 'Unit Petty Cash', role: 'Floating', last4: '9002', limit: 150000, spent: 40500, status: 'FROZEN' },
]
const ST = { ACTIVE: { c: 'st-green', t: 'Active' }, OVER: { c: 'st-red', t: 'Over Limit' }, FROZEN: { c: 'st-gray', t: 'Frozen' } }

export default function ProductionCards() {
  return (
    <div className="mod mod-cards">
      <div className="mod-scroll">
        <table className="cs-table">
          <thead>
            <tr><th>Card Holder</th><th>Card</th><th className="num">Limit</th><th className="num">Spent</th><th className="num">Available</th><th>Status</th></tr>
          </thead>
          <tbody>
            {CARDS.map((c) => (
              <tr key={c.last4}>
                <td className="cs-title">{c.holder}<div className="cards-role">{c.role}</div></td>
                <td>•••• {c.last4}</td>
                <td className="num">{inr(c.limit)}</td>
                <td className="num">{inr(c.spent)}</td>
                <td className="num">{inr(Math.max(0, c.limit - c.spent))}</td>
                <td><span className={`badge ${ST[c.status].c}`}>{ST[c.status].t}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mod-actions">
        <button className="btn btn--ghost">Statements</button>
        <button className="btn">Issue Card</button>
      </div>
    </div>
  )
}
