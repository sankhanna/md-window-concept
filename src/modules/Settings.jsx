import { useState } from 'react'

// Settings — grouped preference rows with toggles.
const GROUPS = [
  { title: 'Account', items: [{ label: 'Profile', value: 'Aviral · Production' }, { label: 'Current Project', value: 'DN6' }] },
  { title: 'Notifications', items: [{ label: 'Push notifications', toggle: true }, { label: 'Email digests', toggle: false }, { label: 'Sound alerts', toggle: true }] },
  { title: 'Appearance', items: [{ label: 'Theme', value: 'Dark' }] },
  { title: 'Security', items: [{ label: 'Two-factor authentication', toggle: true }, { label: 'Active sessions', value: '3 devices' }] },
]

export default function Settings() {
  const [toggles, setToggles] = useState({})
  const isOn = (g, i, def) => (toggles[`${g}-${i}`] ?? def)
  const flip = (g, i, def) => setToggles((t) => ({ ...t, [`${g}-${i}`]: !(t[`${g}-${i}`] ?? def) }))

  return (
    <div className="mod mod-settings">
      <div className="mod-scroll">
        {GROUPS.map((grp) => (
          <div key={grp.title} className="set-group">
            <div className="set-group__title">{grp.title}</div>
            {grp.items.map((it, i) => (
              <div key={it.label} className="set-row">
                <span className="set-row__label">{it.label}</span>
                {'toggle' in it ? (
                  <button className={`toggle ${isOn(grp.title, i, it.toggle) ? 'toggle--on' : ''}`} onClick={() => flip(grp.title, i, it.toggle)}>
                    <span className="toggle__knob" />
                  </button>
                ) : (
                  <span className="set-row__value">{it.value} ›</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
