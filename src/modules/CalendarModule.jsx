import { useState } from 'react'
import WindowModal from '../components/WindowModal.jsx'

// Calendar (mirrors pages/home/newCalendar). "New Event" opens a popup dialog
// scoped to THIS window for creating an event.
const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DAYS = 30 // June 2026, starts Monday

const INITIAL = {
  29: [{ t: '06:30', title: 'Crew Call — Loc B', cls: 'ev-orange' }],
  30: [{ t: '07:00', title: 'Shoot Day 15', cls: 'ev-blue' }],
  24: [{ t: '14:00', title: 'Production Mtg', cls: 'ev-green' }],
  26: [{ t: '10:00', title: 'Recce — Riverside', cls: 'ev-blue' }],
}
const EMPTY = { title: '', day: 30, start: '09:00', end: '10:00', location: '', color: 'ev-blue' }
const COLORS = [['ev-blue', 'Blue'], ['ev-green', 'Green'], ['ev-orange', 'Amber']]

export default function CalendarModule() {
  const [events, setEvents] = useState(INITIAL)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const start = () => { setForm(EMPTY); setOpen(true) }

  const create = () => {
    const day = Number(form.day)
    setEvents((ev) => ({ ...ev, [day]: [...(ev[day] || []), { t: form.start, title: form.title.trim() || 'Untitled', cls: form.color }] }))
    setOpen(false)
  }

  const cells = []
  for (let d = 1; d <= DAYS; d++) cells.push(d)

  const footer = (
    <>
      <button className="btn btn--ghost" onClick={() => setOpen(false)}>Cancel</button>
      <button className="btn" disabled={!form.title.trim()} onClick={create}>Create Event</button>
    </>
  )

  return (
    <div className="mod mod-calendar">
      <div className="cal-toolbar">
        <div className="cal-nav"><button>‹</button><button className="cal-today">Today</button><button>›</button></div>
        <div className="cal-month">June 2026</div>
        <button className="btn cal-new" onClick={start}>+ New Event</button>
      </div>
      <div className="mod-scroll">
        <div className="cal-grid cal-grid--head">
          {DOW.map((d) => <div key={d} className="cal-dow">{d}</div>)}
        </div>
        <div className="cal-grid">
          {cells.map((d) => (
            <div key={d} className={`cal-cell ${d === 29 ? 'cal-cell--today' : ''}`}>
              <span className="cal-num">{d}</span>
              {events[d]?.map((e, j) => (
                <div key={j} className={`cal-event ${e.cls}`}>{e.t} {e.title}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {open && (
        <WindowModal title="New Event" onClose={() => setOpen(false)} footer={footer} size="sm">
          <div className="form">
            <label className="field">
              <span className="field__label">Title</span>
              <input className="field__input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Camera test" autoFocus />
            </label>
            <div className="field-grid">
              <label className="field">
                <span className="field__label">Day (June)</span>
                <input type="number" min="1" max="30" className="field__input" value={form.day} onChange={(e) => set('day', e.target.value)} />
              </label>
              <label className="field">
                <span className="field__label">Start</span>
                <input type="time" className="field__input" value={form.start} onChange={(e) => set('start', e.target.value)} />
              </label>
              <label className="field">
                <span className="field__label">End</span>
                <input type="time" className="field__input" value={form.end} onChange={(e) => set('end', e.target.value)} />
              </label>
            </div>
            <label className="field">
              <span className="field__label">Location</span>
              <input className="field__input" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Optional" />
            </label>
            <div className="field">
              <span className="field__label">Colour</span>
              <div className="swatches">
                {COLORS.map(([cls, label]) => (
                  <button key={cls} type="button" className={`swatch ${cls} ${form.color === cls ? 'is-sel' : ''}`} onClick={() => set('color', cls)}>{label}</button>
                ))}
              </div>
            </div>
          </div>
        </WindowModal>
      )}
    </div>
  )
}
