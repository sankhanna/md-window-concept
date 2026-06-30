// Mock of the Notices/Bulletin board (zillit_web/src/pages/home/noticesV2).
// Chat-style posts: author + role, body, timestamp, edited flag, Read More.
const TABS = ['Bulletin', 'Calendar', 'Call Sheet', 'Test', 'Test 2']

const POSTS = [
  { author: 'Shamsher Singh', role: 'Production coordinator', body: "We'll do a live build tomorrow morning before the unit call. Keep phones charged.", time: 'Jun 27, 2026 at 11:26 PM', edited: true },
  { author: 'Deepak Nayar', role: '2nd assistant director', body: 'Calling on Line 2 still drops on iOS — please test handset-to-handset before today’s setup and report back on this thread.', time: 'Jun 27, 2026 at 11:18 PM', readMore: true },
  { author: 'Priya Menon', role: '1st assistant director', body: 'Crew call moved to 06:30 at Location B (Old Mill). Updated call sheet has been published — re-download it.', time: 'Jun 27, 2026 at 09:02 PM' },
  { author: 'Rohit Verma', role: 'Line producer', body: 'Transport for the camera unit confirmed. Two tempos at base camp by 05:45.', time: 'Jun 26, 2026 at 06:40 PM' },
]

export default function Bulletin() {
  return (
    <div className="mod mod-bulletin">
      <div className="mod-tabs">
        {TABS.map((t, i) => (
          <button key={t} className={`mod-tab ${i === 0 ? 'mod-tab--active' : ''}`}>{t}</button>
        ))}
      </div>
      <div className="mod-scroll">
        {POSTS.map((p, i) => (
          <div key={i} className="post">
            <div className="post__head">{p.author} <span className="post__role">({p.role})</span></div>
            <div className="post__body">{p.body}</div>
            {p.readMore && <a className="post__more">Read More</a>}
            <div className="post__foot">
              {p.edited && <span className="post__edited">Edited</span>}
              <span className="post__time">{p.time}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="composer">
        <input className="composer__input" placeholder="Type your message here..." />
        <button className="composer__send">Send</button>
      </div>
    </div>
  )
}
