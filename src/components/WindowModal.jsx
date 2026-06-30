// WindowModal — a dialog scoped to ONE MDI child window. It renders absolutely
// inside the module container (which is position:relative), so the backdrop and
// panel cover only THIS window's content — not the whole app. That means each
// MDI window manages its own dialogs independently: a wizard can be open in the
// Purchase Order window while a popup is open in the Calendar window, and the
// other windows stay fully interactive.
export default function WindowModal({ title, onClose, footer, children, size = 'md' }) {
  return (
    <div className="winmodal">
      <div className="winmodal__backdrop" onClick={onClose} />
      <div className={`winmodal__panel winmodal__panel--${size}`} role="dialog" aria-modal="true">
        <div className="winmodal__head">
          <span className="winmodal__title">{title}</span>
          <button className="winmodal__x" title="Close" onClick={onClose}>✕</button>
        </div>
        <div className="winmodal__body">{children}</div>
        {footer && <div className="winmodal__foot">{footer}</div>}
      </div>
    </div>
  )
}
