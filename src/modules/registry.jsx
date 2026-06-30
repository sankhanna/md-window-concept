import Bulletin from './Bulletin.jsx'
import Info from './Info.jsx'
import FilmTools from './FilmTools.jsx'
import CalendarModule from './CalendarModule.jsx'
import CallSheet from './CallSheet.jsx'
import Email from './Email.jsx'
import AccountHub from './AccountHub.jsx'
import PurchaseOrder from './PurchaseOrder.jsx'
import DealMemo from './DealMemo.jsx'
import Payroll from './Payroll.jsx'

// Maps a module key (config.js MODULES) to its content component.
const REGISTRY = {
  bulletin: Bulletin,
  info: Info,
  tools: FilmTools,
  calendar: CalendarModule,
  callsheet: CallSheet,
  email: Email,
  accounthub: AccountHub,
  purchaseorder: PurchaseOrder,
  dealmemo: DealMemo,
  payroll: Payroll,
}

// Renders the module-specific content plus a slim shared-socket status strip,
// so every window shows its OWN content while still proving the single socket.
export default function ModuleContent({ moduleKey, session }) {
  const Comp = REGISTRY[moduleKey] || (() => <div className="mod" style={{ padding: 16 }}>Unknown module: {moduleKey}</div>)
  const { status, log } = session
  const last = log[0]
  return (
    <div className="modhost">
      <div className="modhost__body">
        <Comp session={session} />
      </div>
      <div className="modhost__foot" title="All windows share ONE socket connection">
        <span className={`dot ${status.connected ? 'dot--on' : 'dot--off'}`} />
        <span className="modhost__role">{session.role === 'owner' ? 'socket owner' : 'satellite'}</span>
        <span className="modhost__sep">·</span>
        <span>{status.connected ? 'connected' : 'offline'}</span>
        <span className="modhost__sep">·</span>
        <span className="modhost__ev">{log.length} events{last ? ` · last: ${last.event}` : ''}</span>
      </div>
    </div>
  )
}
