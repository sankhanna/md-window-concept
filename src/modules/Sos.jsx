// SOS — emergency screen: a prominent alert button + key contacts.
const CONTACTS = [
  { name: 'Production Office', number: '+44 20 7946 0000' },
  { name: 'Unit Security', number: '+44 7700 900123' },
  { name: 'Nearest Hospital — St. Mary’s', number: '+44 20 7886 6666' },
  { name: 'Local Police', number: '999' },
]

export default function Sos() {
  return (
    <div className="mod mod-sos">
      <div className="mod-scroll">
        <button className="sos-btn">
          <span className="sos-btn__icon">🆘</span>
          <span>Send SOS Alert</span>
          <span className="sos-btn__sub">Notifies production &amp; unit security with your location</span>
        </button>
        <div className="acc-section">Emergency Contacts</div>
        {CONTACTS.map((c) => (
          <div key={c.name} className="sos-contact">
            <div>
              <div className="sos-contact__name">{c.name}</div>
              <div className="sos-contact__num">{c.number}</div>
            </div>
            <button className="cnc-call" title="Call">📞</button>
          </div>
        ))}
      </div>
    </div>
  )
}
