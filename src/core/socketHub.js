// socketHub.js — the single owner-window socket, modeled on
// zillit_web/src/socket/SocketManager.js. Only the OWNER window constructs this.
// Satellites never touch it; they go through the WindowBus.
import { io } from 'socket.io-client'
import { SOCKET_URL, MODULEDATA } from '../config.js'

// Print every socket event to the browser console, with a timestamp + payload.
let seq = 0
function logSocket(event, args) {
  const ts = new Date().toISOString().slice(11, 23)
  console.log(
    `%c[socket]%c #${++seq} ${ts} %c${event}`,
    'color:#f6a02a;font-weight:bold',
    'color:#8aa1b6',
    'color:#5aa2ff;font-weight:bold',
    ...args,
  )
}

export class SocketHub {
  constructor(bus) {
    this.bus = bus
    this.socket = null
    this.connected = false
    this._wireBusEmitRequests()
  }

  connect() {
    if (this.socket) return
    // Same handshake shape as the real SocketManager.connectSocket().
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      auth: { moduledata: MODULEDATA },
    })

    this.socket.on('connect', () => {
      this.connected = true
      this.bus.broadcastOwnerStatus({
        connected: true,
        socketId: this.socket.id,
        ownerId: this.bus.windowId,
      })
      logSocket('connect', [{ id: this.socket.id }])
      // Mirror SocketManager: announce presence on connect.
      this.socket.emit('user:join', {}, null, () => {})
      this._log('connect', { id: this.socket.id })
    })

    this.socket.on('disconnect', (reason) => {
      this.connected = false
      this.bus.broadcastOwnerStatus({ connected: false, ownerId: this.bus.windowId })
      logSocket('disconnect', [{ reason }])
      this._log('disconnect', { reason })
    })

    this.socket.on('connect_error', (err) => {
      logSocket('connect_error', [{ message: err?.message || String(err) }])
      this._log('connect_error', { message: err?.message || String(err) })
    })

    // Fan EVERY inbound socket event out to all windows over the bus,
    // and print it to the browser console.
    this.socket.onAny((event, ...args) => {
      logSocket(event, args)
      this.bus.fanoutSocketEvent(event, args)
    })
  }

  // Owner performs emits requested by satellite windows, relaying the ack back.
  _wireBusEmitRequests() {
    this.bus.addEventListener('emit-request', (e) => {
      const { reqId, event, payload } = e.detail
      if (!this.socket) {
        this.bus.replyEmitAck(reqId, { error: 'no-socket' })
        return
      }
      this.socket.emit(event, payload, null, (ack) => {
        this.bus.replyEmitAck(reqId, ack ?? { ok: true })
      })
    })
  }

  // Also surface owner-side socket events locally (the owner window's own log).
  _log(event, args) {
    this.bus.fanoutSocketEvent(`hub:${event}`, [args])
    this.bus.dispatchEvent(
      new CustomEvent('socket-event', { detail: { event: `hub:${event}`, args: [args] } }),
    )
  }
}
