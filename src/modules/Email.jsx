// Mock of the Email module (zillit_web/src/components/email_v2).
// Folder sidebar + inbox list (sender, subject, preview, time, unread, attachment).
const FOLDERS = [
  { name: 'Inbox', count: 12, active: true },
  { name: 'Sent', count: 0 },
  { name: 'Drafts', count: 3 },
  { name: 'Trash', count: 0 },
]

const MAILS = [
  { from: 'Anika Rao', subject: 'Revised budget — Dept. breakdown', preview: 'Attaching the updated department budget for your sign-off before…', time: '2:45 PM', unread: true, attach: true },
  { from: 'Vendor — GreenSet', subject: 'Set construction invoice #4471', preview: 'Please find the invoice for the warehouse set build attached…', time: '11:20 AM', unread: true, attach: true },
  { from: 'Karan Joshi', subject: 'Re: Location B access', preview: 'Confirmed — gates open from 05:30. Security will have the list…', time: 'Yesterday', unread: false, attach: false },
  { from: 'Studio Floor', subject: 'Daily production report — Day 13', preview: 'Scenes completed: 6 of 8. Wrap at 19:40. Notes below…', time: 'Mon', unread: false, attach: true },
]

export default function Email() {
  return (
    <div className="mod mod-email">
      <div className="email-side">
        <button className="email-compose">New mail</button>
        {FOLDERS.map((f) => (
          <button key={f.name} className={`email-folder ${f.active ? 'email-folder--active' : ''}`}>
            <span>{f.name}</span>{f.count > 0 && <span className="email-folder__count">{f.count}</span>}
          </button>
        ))}
      </div>
      <div className="email-list mod-scroll">
        {MAILS.map((m, i) => (
          <div key={i} className={`mail ${m.unread ? 'mail--unread' : ''}`}>
            <div className="mail__top">
              <span className="mail__from">{m.unread && <span className="mail__dot" />}{m.from}</span>
              <span className="mail__time">{m.attach && <span className="mail__clip">📎</span>}{m.time}</span>
            </div>
            <div className="mail__subject">{m.subject}</div>
            <div className="mail__preview">{m.preview}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
