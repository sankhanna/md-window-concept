// Mock of the Calendar view (zillit_web/src/pages/home/newCalendar/Calendar.jsx).
// Simple month grid with a few production events.
const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
// June 2026 starts on a Monday; 30 days.
const FIRST_OFFSET = 0
const DAYS = 30

const EVENTS = {
  29: [{ t: '06:30', title: 'Crew Call — Loc B', cls: 'ev-orange' }],
  30: [{ t: '07:00', title: 'Shoot Day 15', cls: 'ev-blue' }],
  24: [{ t: '14:00', title: 'Production Mtg', cls: 'ev-green' }],
  26: [{ t: '10:00', title: 'Recce — Riverside', cls: 'ev-blue' }],
}

export default function CalendarModule() {
  const cells = []
  for (let i = 0; i < FIRST_OFFSET; i++) cells.push(null)
  for (let d = 1; d <= DAYS; d++) cells.push(d)

  return (
    <div className="mod mod-calendar">
      <div className="cal-toolbar">
        <div className="cal-nav"><button>‹</button><button className="cal-today">Today</button><button>›</button></div>
        <div className="cal-month">June 2026</div>
        <div className="cal-views"><button className="cal-view--active">Month</button><button>Week</button><button>Day</button></div>
      </div>
      <div className="mod-scroll">
        <div className="cal-grid cal-grid--head">
          {DOW.map((d) => <div key={d} className="cal-dow">{d}</div>)}
        </div>
        <div className="cal-grid">
          {cells.map((d, i) => (
            <div key={i} className={`cal-cell ${d === 29 ? 'cal-cell--today' : ''}`}>
              {d && <span className="cal-num">{d}</span>}
              {d && EVENTS[d]?.map((e, j) => (
                <div key={j} className={`cal-event ${e.cls}`}>{e.t} {e.title}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
