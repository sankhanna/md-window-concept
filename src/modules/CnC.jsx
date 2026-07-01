// C & C (Command & Control) — chat + calls, the Zillit comms hub.
const TABS = ['Chats', 'Calls']

const THREADS = [
  { name: 'Deepak Nayar', role: '2nd assistant director', last: 'Calling on Line 2 still drops on iOS…', time: '11:18 PM', unread: 2 },
  { name: 'Priya Menon', role: '1st assistant director', last: 'Crew call moved to 06:30 at Loc B.', time: '09:02 PM', unread: 0 },
  { name: 'Production Group', role: '12 members', last: 'Shamsher: We’ll do a live build tomorrow.', time: 'Yesterday', unread: 0 },
  { name: 'Rohit Verma', role: 'Line producer', last: 'Transport confirmed for the camera unit.', time: 'Mon', unread: 0 },
]

export default function CnC() {
  return (
    <div className="mod mod-cnc">
      <div className="mod-tabs">
        {TABS.map((t, i) => <button key={t} className={`mod-tab ${i === 0 ? 'mod-tab--active' : ''}`}>{t}</button>)}
      </div>
      <div className="mod-scroll">
        {THREADS.map((c) => (
          <div key={c.name} className={`cnc-row ${c.unread ? 'cnc-row--unread' : ''}`}>
            <span className="cnc-avatar">{c.name[0]}</span>
            <div className="cnc-main">
              <div className="cnc-top"><span className="cnc-name">{c.name}</span><span className="cnc-time">{c.time}</span></div>
              <div className="cnc-role">{c.role}</div>
              <div className="cnc-last">{c.last}</div>
            </div>
            <div className="cnc-actions">
              {c.unread > 0 && <span className="cnc-unread">{c.unread}</span>}
              <button className="cnc-call" title="Call">📞</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mod-actions">
        <button className="btn btn--ghost">New Group</button>
        <button className="btn">New Chat</button>
      </div>
    </div>
  )
}
