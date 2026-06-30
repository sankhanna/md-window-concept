import { useState } from 'react'
import Stepper from '../components/Stepper.jsx'

// Purchase Order — PO register (mirrors the Purchase Order film tool).
// "Raise PO" switches the WHOLE window to a wizard screen (not a popup); the
// register is restored via the Back link or after Create PO.
const TABS = ['All', 'Pending', 'Approved', 'Closed']
const DEPTS = ['Art & Set', 'Camera', 'Lighting', 'Production', 'Transport', 'Costume', 'Sound']

const INITIAL = [
  { no: 'PO-2041', vendor: 'GreenSet Builders', dept: 'Art & Set', amount: 840000, status: 'PENDING' },
  { no: 'PO-2040', vendor: 'CineRent Camera', dept: 'Camera', amount: 1275000, status: 'APPROVED' },
  { no: 'PO-2039', vendor: 'Spotboy Catering', dept: 'Production', amount: 195000, status: 'APPROVED' },
  { no: 'PO-2038', vendor: 'Apex Transport', dept: 'Transport', amount: 310000, status: 'CLOSED' },
]

const ST = { PENDING: { c: 'st-orange', t: 'Pending' }, APPROVED: { c: 'st-green', t: 'Approved' }, CLOSED: { c: 'st-gray', t: 'Closed' } }
const inr = (n) => `₹ ${Number(n || 0).toLocaleString('en-IN')}`
const STEPS = ['Vendor & Dept', 'Line Item', 'Review']
const EMPTY = { vendor: '', dept: 'Art & Set', date: '2026-06-30', item: '', qty: 1, rate: '' }

export default function PurchaseOrder() {
  const [pos, setPos] = useState(INITIAL)
  const [wizard, setWizard] = useState(false)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(EMPTY)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const amount = (Number(form.qty) || 0) * (Number(form.rate) || 0)

  const start = () => { setForm(EMPTY); setStep(0); setWizard(true) }
  const close = () => setWizard(false)

  const canNext =
    (step === 0 && form.vendor.trim() && form.dept) ||
    (step === 1 && form.item.trim() && Number(form.qty) > 0 && Number(form.rate) > 0)

  const submit = () => {
    const nextNo = `PO-${2042 + (pos.length - INITIAL.length)}`
    setPos((list) => [{ no: nextNo, vendor: form.vendor.trim(), dept: form.dept, amount, status: 'PENDING' }, ...list])
    setWizard(false)
  }

  // ---- wizard screen (takes over the whole window) ----
  if (wizard) {
    return (
      <div className="mod mod-po">
        <div className="wizard">
          <div className="wizard__head">
            <button className="wizard__back" onClick={close}>← Purchase Orders</button>
            <span className="wizard__title">Raise Purchase Order</span>
            <span className="wizard__step-of">Step {step + 1} of {STEPS.length}</span>
          </div>

          <div className="wizard__steps"><Stepper steps={STEPS} current={step} /></div>

          <div className="wizard__body">
            <div className="wizard__panel">
              {step === 0 && (
                <div className="form">
                  <label className="field">
                    <span className="field__label">Vendor</span>
                    <input className="field__input" value={form.vendor} onChange={(e) => set('vendor', e.target.value)} placeholder="e.g. Lumière Lighting" autoFocus />
                  </label>
                  <div className="field-grid">
                    <label className="field">
                      <span className="field__label">Department</span>
                      <select className="field__input" value={form.dept} onChange={(e) => set('dept', e.target.value)}>
                        {DEPTS.map((d) => <option key={d}>{d}</option>)}
                      </select>
                    </label>
                    <label className="field">
                      <span className="field__label">PO Date</span>
                      <input type="date" className="field__input" value={form.date} onChange={(e) => set('date', e.target.value)} />
                    </label>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="form">
                  <label className="field">
                    <span className="field__label">Item / Service</span>
                    <input className="field__input" value={form.item} onChange={(e) => set('item', e.target.value)} placeholder="e.g. 4x HMI 1.2kW (rental, 6 wk)" autoFocus />
                  </label>
                  <div className="field-grid">
                    <label className="field">
                      <span className="field__label">Quantity</span>
                      <input type="number" min="1" className="field__input" value={form.qty} onChange={(e) => set('qty', e.target.value)} />
                    </label>
                    <label className="field">
                      <span className="field__label">Rate (₹)</span>
                      <input type="number" min="0" className="field__input" value={form.rate} onChange={(e) => set('rate', e.target.value)} placeholder="0" />
                    </label>
                  </div>
                  <div className="amount-row"><span>Amount</span><strong>{inr(amount)}</strong></div>
                </div>
              )}

              {step === 2 && (
                <div className="review">
                  <div className="review__row"><span>Vendor</span><strong>{form.vendor}</strong></div>
                  <div className="review__row"><span>Department</span><strong>{form.dept}</strong></div>
                  <div className="review__row"><span>PO Date</span><strong>{form.date}</strong></div>
                  <div className="review__row"><span>Item</span><strong>{form.item}</strong></div>
                  <div className="review__row"><span>Qty × Rate</span><strong>{form.qty} × {inr(form.rate)}</strong></div>
                  <div className="review__row review__row--total"><span>Total</span><strong>{inr(amount)}</strong></div>
                  <p className="review__note">Will be raised as <span className="badge st-orange">Pending</span> for approval.</p>
                </div>
              )}
            </div>
          </div>

          <div className="wizard__foot">
            {step > 0
              ? <button className="btn btn--ghost" onClick={() => setStep(step - 1)}>Back</button>
              : <button className="btn btn--ghost" onClick={close}>Cancel</button>}
            {step < 2
              ? <button className="btn" disabled={!canNext} onClick={() => setStep(step + 1)}>Next</button>
              : <button className="btn" onClick={submit}>Create PO</button>}
          </div>
        </div>
      </div>
    )
  }

  // ---- register list ----
  return (
    <div className="mod mod-po">
      <div className="mod-tabs">
        {TABS.map((t, i) => <button key={t} className={`mod-tab ${i === 0 ? 'mod-tab--active' : ''}`}>{t}</button>)}
      </div>
      <div className="mod-scroll">
        <table className="cs-table">
          <thead>
            <tr><th>PO #</th><th>Vendor</th><th>Department</th><th className="num">Amount</th><th>Status</th></tr>
          </thead>
          <tbody>
            {pos.map((p) => (
              <tr key={p.no}>
                <td className="cs-title">{p.no}</td>
                <td>{p.vendor}</td>
                <td>{p.dept}</td>
                <td className="num">{inr(p.amount)}</td>
                <td><span className={`badge ${ST[p.status].c}`}>{ST[p.status].t}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mod-actions">
        <button className="btn btn--ghost">Export</button>
        <button className="btn" onClick={start}>Raise PO</button>
      </div>
    </div>
  )
}
