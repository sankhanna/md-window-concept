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
import CnC from './CnC.jsx'
import Settings from './Settings.jsx'
import Sos from './Sos.jsx'
import Help from './Help.jsx'
import Invoices from './Invoices.jsx'
import ProductionCards from './ProductionCards.jsx'
import GenericSection from './GenericSection.jsx'

// Maps a module key (config.js MODULE_META) to its content component.
const REGISTRY = {
  home: Bulletin, // Home shows the bulletin / notices board
  bulletin: Bulletin,
  info: Info,
  tools: FilmTools,
  calendar: CalendarModule,
  callsheet: CallSheet,
  email: Email,
  cnc: CnC,
  settings: Settings,
  sos: Sos,
  help: Help,
  accounthub: AccountHub,
  purchaseorder: PurchaseOrder,
  dealmemo: DealMemo,
  payroll: Payroll,
  // Account Hub sub-tools
  invoices: Invoices,
  productioncards: ProductionCards,
  productionsetup: GenericSection,
  pettycash: GenericSection,
  costreport: GenericSection,
  periodclose: GenericSection,
  vendors: GenericSection,
}

// Renders the module-specific content plus a slim shared-socket status strip,
// so every window shows its OWN content while still proving the single socket.
export default function ModuleContent({ moduleKey, session, openModule }) {
  const Comp = REGISTRY[moduleKey] || (() => <div className="mod" style={{ padding: 16 }}>Unknown module: {moduleKey}</div>)
  const { status, log } = session
  const last = log[0]
  return (
    <div className="modhost">
      <div className="modhost__body">
        <Comp session={session} openModule={openModule} moduleKey={moduleKey} />
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
