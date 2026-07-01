import { useState } from 'react'

// Account Hub — a mini-app hub. Left sub-menu (Setup / Transactions / Payroll /
// Reports / Management) + a Purchase Orders overview panel. Clicking any sub-menu
// item opens that tool as its OWN MDI window (via openModule).
const MENU = [
  { section: 'Setup', items: [{ key: 'productionsetup', label: 'Production Setup', icon: '⚙️' }] },
  {
    section: 'Transactions',
    items: [
      { key: 'purchaseorder', label: 'Purchase Orders', icon: '🛒' },
      { key: 'invoices', label: 'Invoices / Accounts Payable', icon: '📄' },
      { key: 'productioncards', label: 'Production Cards', icon: '💳' },
      { key: 'pettycash', label: 'Petty Cash Expenses', icon: '💰' },
    ],
  },
  { section: 'Payroll Management', items: [{ key: 'payroll', label: 'Payroll', icon: '💵' }] },
  {
    section: 'Reports',
    items: [
      { key: 'costreport', label: 'Cost Report', icon: '📊' },
      { key: 'periodclose', label: 'Period Close', icon: '🔒' },
    ],
  },
  { section: 'Management', items: [{ key: 'vendors', label: 'Vendors', icon: '🏢' }] },
]

const STATS = [
  { label: 'My POs', value: '0', cls: 'stat--amber' },
  { label: 'Pending', value: '0', cls: '' },
  { label: 'Ready to Process', value: '0', cls: 'stat--green' },
  { label: 'Assigned Depts', value: '—', cls: '' },
  { label: 'My Committed', value: '₹0', cls: 'stat--amber' },
]

export default function AccountHub({ openModule }) {
  const [active, setActive] = useState('purchaseorder')

  const openTool = (key) => {
    setActive(key)
    openModule?.(key)
  }

  return (
    <div className="mod mod-account ah">
      <aside className="ah__side">
        <div className="ah__side-head"><span className="ah__back">‹</span> Account Hub</div>
        {MENU.map((grp) => (
          <div key={grp.section} className="ah__group">
            <div className="ah__group-title">{grp.section}</div>
            {grp.items.map((it) => (
              <button
                key={it.key}
                className={`ah__item ${active === it.key ? 'ah__item--active' : ''}`}
                onClick={() => openTool(it.key)}
                title={`Open ${it.label} in its own window`}
              >
                <span className="ah__item-icon">{it.icon}</span>
                <span className="ah__item-label">{it.label}</span>
              </button>
            ))}
          </div>
        ))}
      </aside>

      <div className="ah__main mod-scroll">
        <div className="ah__crumb">TRANSACTIONS</div>
        <h2 className="ah__title">Purchase Orders</h2>
        <p className="ah__sub">Full PO lifecycle — raise, approve, process, post, invoice, and close.</p>

        <input className="ah__search" placeholder="Search all POs — by number, vendor, description, amount, code, date, item…" />

        <div className="ah__tabsrow">
          <div className="ah__tabs">
            <button className="ah__tab">All POs</button>
            <button className="ah__tab ah__tab--active">Queue</button>
            <button className="ah__tab">PO Entry</button>
            <button className="ah__tab">Reports</button>
          </div>
          <button className="btn ah__enter" onClick={() => openTool('purchaseorder')}>+ Enter PO</button>
        </div>

        <div className="ah__filters">
          <span className="ah__filters-label">QUICK FILTERS:</span>
          <button className="ah__pill ah__pill--active">All</button>
          <button className="ah__pill">Pending</button>
          <button className="ah__pill">Approved</button>
          <button className="ah__pill">Rejected</button>
        </div>

        <div className="ah__stats">
          {STATS.map((s) => (
            <div key={s.label} className="ah__stat">
              <div className="ah__stat-label">{s.label}</div>
              <div className={`ah__stat-value ${s.cls}`}>{s.value}</div>
            </div>
          ))}
        </div>

        <table className="cs-table ah__table">
          <thead>
            <tr><th>PO Number</th><th>Vendor</th><th>Dept</th><th className="num">Amount</th><th>Eff. Date</th><th>Status</th><th>Assigned</th></tr>
          </thead>
          <tbody>
            <tr><td colSpan="7" className="ah__empty">No POs in this queue.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
