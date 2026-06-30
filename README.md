# Zillit · Multi-Window Concept

Prototype proving that Zillit can support **many windows on one socket** — the
"in-app panes + pop-outs" approach. Wired to the **dev** environment
(`cncapi-dev.zillit.com`).

## Deploy to Vercel

This is a static Vite SPA — Vercel auto-detects the framework; `vercel.json`
pins it (`framework: vite`, `dist`, SPA rewrite).

```bash
npm i -g vercel        # CLI not installed by default
vercel login
vercel link            # link/create the project (run once)
vercel deploy          # preview deployment
vercel deploy --prod   # production
```

Or import the repo at vercel.com/new (Git push → auto-deploy). Config (all
optional, defaults baked in) is set in **Settings → Environment Variables** or
via `vercel env add`: `VITE_SOCKET_URL`, `VITE_CNC_BASE_URL`, `VITE_MODULEDATA`.

> ⚠️ **Live socket on the deployed URL.** The dev server only accepts origins in
> its CORS allow-list — `zillit.com`, `localhost:5174`, `localhost:3000`. A
> `*.vercel.app` origin is **rejected**, so the socket footer will read
> *offline* there (the MDI UI + module mocks still work fully). To get the live
> socket on the deployment, either add the Vercel domain to the dev server's
> `ALLOW_ACCESS_ORIGIN`, or serve it under a `*.zillit.com` custom domain.

## The finding that makes this possible

The single-window restriction is **not** an architectural limit — it is one
frontend guard:

- **Backend (`zillit_cnc`)** imposes *no* single-session limit. Socket auth
  (`auth.moduledata` → `device_id`) joins **rooms** (user / device / project /
  chat) and every emit targets a room, never a single `socket.id`. So any number
  of a user's windows already receive all events. *(Verified: two concurrent
  connections from the same `moduledata` coexisted with no kick-off.)*
- **Frontend (`zillit_web/src/App.jsx:362-398`)** is the only blocker: a
  `BroadcastChannel('myChannel')` posts `newTabOpened`, and other tabs redirect
  to `google.com` (`App.jsx:521`). It is already bypassed during a call
  (`!getCallData`) — proof the lock is a policy choice, not a requirement.

## The UI: MDI workspace

Clicking a module in the sidebar opens it as an **MDI child window** inside the
main workspace — draggable by its title bar, resizable from the corner grip,
focus-on-click (z-order), **minimize** (to a taskbar), **maximize** (double-click
the bar), and **close**. Open many at once; *Cascade* / *Close all* in the
toolbar. The title-bar **⤢** detaches a child into a real OS window. Every MDI
child still shares the **single** socket — see `src/components/mdi/`.

Each window renders its **own module content** (not a shared panel), built from
the real `zillit_web` section structure & labels — see `src/modules/`:

| Window | Mirrors | Content |
|---|---|---|
| Bulletin | `pages/home/noticesV2` | tabs + chat-style posts (author/role/body/time) |
| Info | `pages/FilmTools/info` | info posts w/ PDF/.fdx attachments + upload drop-zone |
| Film Tools | `pages/FilmTools/FilmTools.jsx` | tool-card grid (real `sectionList` names) + badges |
| Call Sheet | `call-sheet/CallSheetApp.jsx` | Drafts/Approvals tabs, status badges, SWD/CWD/SCWD |
| Calendar | `pages/home/newCalendar` | month grid + production events + view toolbar |
| Email | `components/email_v2` | folder sidebar + inbox list (sender/subject/preview) |

`src/modules/registry.jsx` maps a module key → component and adds the slim
shared-socket status strip at the bottom of every window.

## The connection mechanism

One window is the **owner** (holds the single socket). Every other window is a
**satellite** (no socket; relays through the owner). MDI children live inside the
owner window, so they use the socket directly; OS pop-outs are satellites.

- **`src/core/windowBus.js`** — cross-window transport (`BroadcastChannel`) +
  **owner election via the Web Locks API** (`navigator.locks`). The owner holds
  an exclusive lock for its lifetime; when it closes, the lock releases and a
  satellite is **auto-promoted** and opens the socket. No "dead owner" problem.
- **`src/core/socketHub.js`** — the single socket, modeled on
  `zillit_web/src/socket/SocketManager.js` (same `io(url, {transports:
  ['websocket'], auth:{moduledata}})`, same `user:join` on connect). `socket.onAny`
  fans every inbound event out to all windows over the bus. Satellite
  `emit-request`s are performed here and the server ack is relayed back.
- **`src/useWindowSession.js`** — React hook tying it together; `emit()` routes
  through the owner transparently regardless of which window calls it.
- **`src/App.jsx`** — shell (sidebar + main pane) with a **⤢ pop-out** button per
  module. A pop-out is the same app at `?module=<key>`, rendering one module.

### Verified against dev

1. Owner election is exclusive (`★ OWNER`).
2. The shared socket connects to dev with `moduledata` (`socket connected`,
   real socket id).
3. Full relay loop: satellite `emit-request('user:list')` → owner emits on the
   shared socket → dev server ack (`cnc_project_invalid`, expected for an empty
   payload) → relayed back to the satellite. Round-trip works.

## Run it

```bash
npm install
npm run dev            # http://localhost:5174  (port matters — see below)
```

Open `http://localhost:5174`, then click **⤢** on any module to pop it into its
own window. Open several. They share one socket; the event log stays in lock-step.

> **Port 5174 is required.** The dev socket CORS allow-list
> (`ALLOW_ACCESS_ORIGIN = zillit.com,localhost:5174,localhost:3000`) rejects other
> localhost ports, so the browser websocket handshake only succeeds on 5174/3000.

> `src/config.js` holds the fixed dev `moduledata` token (supplied out-of-band).
> In the real app it is generated per-session by `encryptHeaders()`.

## Porting into `zillit_web`

1. **Relax the single-tab lock** (`App.jsx:362-398`): instead of redirecting
   extra same-origin windows to Google, recognise them as the user's own windows.
   The simplest replacement is the election here — drop the `newTabOpened`
   redirect and let `navigator.locks` decide the owner.
2. **Make `SocketManager` the owner-only socket.** Only the lock holder calls
   `connectSocket()`; satellites use the bus. `SocketManager`'s existing
   singleton + `beforeunload` cleanup already fit; the bus's lock release on
   unload promotes the next window.
3. **Route module emits through the bus** so satellites can act without their own
   socket. The app already uses the `emit(event, data, null, cb)` convention,
   which the relay preserves.
4. **Calling stays owner-pinned.** A `RTCPeerConnection` / Agora / mediasoup
   client cannot be shared across windows, so the call should live in the owner
   window (or the window that initiated it becomes/stays owner). The existing
   `!getCallData` exception is the seam for this.

### Alternative (even simpler, server already supports it)

Because the backend delivers to rooms and allows multiple connections, each
window could instead open **its own** socket with the same `moduledata` — no
relay needed. Trade-off: N connections instead of 1, and duplicate client-side
side-effects (toasts, unread counts) must be made idempotent. The owner/relay
model in this prototype keeps it to one connection and one source of truth.
