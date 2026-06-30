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

// The modules a user can open. Mirrors the Zillit sidebar / Film-Tools grid.
export const MODULES = [
  { key: 'bulletin', label: 'Bulletin', icon: '📌' },
  { key: 'info', label: 'Info', icon: 'ℹ️' },
  { key: 'tools', label: 'Film Tools', icon: '🛠️' },
  { key: 'calendar', label: 'Calendar', icon: '📅' },
  { key: 'callsheet', label: 'Call Sheet', icon: '🎬' },
  { key: 'email', label: 'Email', icon: '✉️' },
  { key: 'accounthub', label: 'Account Hub', icon: '🏦' },
  { key: 'purchaseorder', label: 'Purchase Order', icon: '🧾' },
  { key: 'dealmemo', label: 'Deal Memo', icon: '📝' },
  { key: 'payroll', label: 'Payroll', icon: '💵' },
]
