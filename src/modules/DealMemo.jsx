// Deal Memo — crew engagement memos (mirrors the Deal Memo film tool).
const TABS = ['Drafts', 'Sent', 'Signed']

const MEMOS = [
  { name: 'Anjali Sharma', role: 'Director of Photography', rate: '₹ 75,000 / day', dates: '29 Jun – 12 Aug', status: 'SIGNED' },
  { name: 'Imran Qureshi', role: 'Gaffer', rate: '₹ 18,000 / day', dates: '29 Jun – 12 Aug', status: 'PENDING' },
  { name: 'Meera Nair', role: 'Costume Designer', rate: '₹ 22,000 / day', dates: '20 Jun – 12 Aug', status: 'SENT' },
  { name: 'Rahul Dev', role: 'Sound Recordist', rate: '₹ 16,500 / day', dates: '29 Jun – 12 Aug', status: 'DRAFT' },
]

const ST = { SIGNED: { c: 'st-green', t: 'Signed' }, PENDING: { c: 'st-blue', t: 'Awaiting Signature' }, SENT: { c: 'st-orange', t: 'Sent' }, DRAFT: { c: 'st-gray', t: 'Draft' } }

export default function DealMemo() {
  return (
    <div className="mod mod-dealmemo">
      <div className="mod-tabs">
        {TABS.map((t, i) => <button key={t} className={`mod-tab ${i === 0 ? 'mod-tab--active' : ''}`}>{t}</button>)}
      </div>
      <div className="mod-scroll">
        <table className="cs-table">
          <thead>
            <tr><th>Crew Member</th><th>Role</th><th>Rate</th><th>Engagement</th><th>Status</th></tr>
          </thead>
          <tbody>
            {MEMOS.map((m) => (
              <tr key={m.name}>
                <td className="cs-title">{m.name}</td>
                <td>{m.role}</td>
                <td>{m.rate}</td>
                <td>{m.dates}</td>
                <td><span className={`badge ${ST[m.status].c}`}>{ST[m.status].t}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mod-actions">
        <button className="btn btn--ghost">Template</button>
        <button className="btn">New Deal Memo</button>
      </div>
    </div>
  )
}
