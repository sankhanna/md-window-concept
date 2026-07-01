// Zillit Help — searchable help topics + support.
const TOPICS = [
  { t: 'Getting started with Zillit', d: 'Set up your profile, project and first tools.' },
  { t: 'Using C & C — calls & chat', d: 'Placing calls, groups, and troubleshooting audio.' },
  { t: 'Working with Tools', d: 'Budgets, call sheets, purchase orders and more.' },
  { t: 'Managing your project & users', d: 'Invite crew, set permissions and access.' },
  { t: 'Troubleshooting connectivity', d: 'What to do when the socket goes offline.' },
]

export default function Help() {
  return (
    <div className="mod mod-help">
      <div className="tools__bar">
        <input className="tools__search" placeholder="Search help articles..." />
      </div>
      <div className="mod-scroll">
        {TOPICS.map((h) => (
          <div key={h.t} className="help-topic">
            <div className="help-topic__t">{h.t}</div>
            <div className="help-topic__d">{h.d}</div>
          </div>
        ))}
      </div>
      <div className="mod-actions">
        <button className="btn">Contact Support</button>
      </div>
    </div>
  )
}
