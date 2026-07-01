// Dev environment wiring (mirrors zillit_web/src/config.js → config.socket).
// In the real app, `moduledata` is produced per-request by encryptHeaders() from
// localStorage (device_id, project_id, user_id, scanner_device_id). For this
// prototype it is a fixed dev token supplied out-of-band so the prototype can
// authenticate against the live dev socket without the full login flow.
//
// Values come from Vite env vars (set them in `.env.local` for local dev, or as
// Project Environment Variables in Vercel) and fall back to the dev defaults so
// the prototype runs with zero config. NOTE: Vite inlines VITE_* vars into the
// client bundle at build time, so MODULEDATA is visible to anyone who loads the
// page — it is a low-value dev token, but do not put a real secret here.
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://cncapi-dev.zillit.com'
export const CNC_BASE_URL = import.meta.env.VITE_CNC_BASE_URL || 'https://cncapi-dev.zillit.com/api'

export const MODULEDATA =
  import.meta.env.VITE_MODULEDATA ||
  'e2153034c9ce2eb53a890f8724a41fd1048dd2790db5c3c7336936afef78fd15e5b742d2eec1b809b902c5d23e2e6884105f1040762058d55137b9aedc29150dc9cedcd6f3e7433bb04502a09e034546f7bb3fc8234e3cfd74ae425f12bf2e7911207802c41895297be55ee742cb3c3a84c42ace7647a2e413c136f5dbdc953caf19f1e63a4f9b147a0419a0b43c02667fcadada55d17923f72b8b88f40eef041737743f750dc0ee6ecf9994b6891dccfe378bf166910a1d39e3eedfcc05f67354c07a9be2fbc599a5986df340dfa9a3476287433e41bbd5759cb03794b9edbd'

// Metadata (label + icon) for EVERY openable module. Used for window titles and
// the top-bar switcher chips — includes modules that aren't top-level menu items
// but can be opened from elsewhere (e.g. Account Hub from the Tools grid).
export const MODULE_META = {
  home: { label: 'Home', icon: '🏠' },
  email: { label: 'Email', icon: '✉️' },
  tools: { label: 'Tools', icon: '🛠️' },
  cnc: { label: 'C & C', icon: '📞' },
  settings: { label: 'Settings', icon: '⚙️' },
  sos: { label: 'SOS', icon: '🆘' },
  help: { label: 'Zillit Help', icon: '❓' },
  // openable from the Tools grid / dialogs
  accounthub: { label: 'Account Hub', icon: '🏦' },
  purchaseorder: { label: 'Purchase Orders', icon: '🛒' },
  dealmemo: { label: 'Deal Memo', icon: '📝' },
  payroll: { label: 'Payroll', icon: '💵' },
  // Account Hub sub-tools (open as their own MDI windows)
  productionsetup: { label: 'Production Setup', icon: '⚙️' },
  invoices: { label: 'Invoices / Accounts Payable', icon: '📄' },
  productioncards: { label: 'Production Cards', icon: '💳' },
  pettycash: { label: 'Petty Cash Expenses', icon: '💰' },
  costreport: { label: 'Cost Report', icon: '📊' },
  periodclose: { label: 'Period Close', icon: '🔒' },
  vendors: { label: 'Vendors', icon: '🏢' },
  // still-registered content (reused / reachable elsewhere)
  bulletin: { label: 'Bulletin', icon: '📌' },
  info: { label: 'Info', icon: 'ℹ️' },
  calendar: { label: 'Calendar', icon: '📅' },
  callsheet: { label: 'Call Sheet', icon: '🎬' },
}

// The left menu, in display order. Items with `action` run a utility action
// instead of opening a window; `badge` shows an unread count.
export const MENU = [
  { key: 'home' },
  { key: 'email' },
  { key: 'tools' },
  { key: 'cnc', badge: 2 },
  { key: 'settings' },
  { key: 'sos' },
  { key: 'pintostart', label: 'Pin to Start', icon: '📌', action: 'pin' },
  { key: 'help' },
  { key: 'logout', label: 'Logout', icon: '⏻', action: 'logout' },
]
