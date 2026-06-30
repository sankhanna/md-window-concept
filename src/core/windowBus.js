// windowBus.js — cross-window relay + single-owner election.
//
// Problem it solves: we want many windows but only ONE socket connection.
// Exactly one window is the "owner" (holds the socket). Every other window is a
// "satellite": it has no socket, it relays outbound emits to the owner and
// receives inbound socket events the owner fans out.
//
// Election uses the Web Locks API: the owner holds an exclusive lock for its
// whole lifetime. When the owner window closes, the browser releases the lock
// and a waiting satellite is granted it — instantly promoting it to owner. This
// is robust against the owner tab being closed mid-session (the old single-tab
// pain point).
//
// Transport between windows is BroadcastChannel — same-origin, no window.opener
// reference needed, so it works for tabs, pop-outs and separate windows alike.

const CHANNEL = 'zillit-window-bus'
const LOCK = 'zillit-socket-owner'

const rand = () => Math.random().toString(36).slice(2, 10)

export class WindowBus extends EventTarget {
  constructor() {
    super()
    this.windowId = `${Date.now().toString(36)}-${rand()}`
    this.isOwner = false
    this.channel = new BroadcastChannel(CHANNEL)
    this.channel.onmessage = (e) => this._onMessage(e.data)
    this._ackWaiters = new Map()
    this._releaseLock = null
    this._abort = new AbortController()
  }

  // Begin participating. `onBecomeOwner` runs once this window wins the lock.
  start(onBecomeOwner) {
    this._onBecomeOwner = onBecomeOwner
    // Acquire the exclusive lock. We hold it (promise stays pending) until either
    // the window unloads or close() releases it — releasing on close() keeps this
    // safe under React StrictMode's mount→unmount→remount double-invoke.
    navigator.locks
      .request(LOCK, { mode: 'exclusive', signal: this._abort.signal }, () => {
        this.isOwner = true
        this.dispatchEvent(new CustomEvent('role', { detail: { isOwner: true } }))
        this._onBecomeOwner?.()
        return new Promise((resolve) => {
          this._releaseLock = resolve
        })
      })
      .catch(() => {}) // aborted request rejects — expected on cleanup
  }

  // ---- messaging primitives ----
  _post(msg) {
    this.channel.postMessage({ ...msg, from: this.windowId })
  }

  _onMessage(msg) {
    if (!msg || msg.from === this.windowId) return
    switch (msg.type) {
      case 'socket-event': // owner → everyone: a socket event arrived
        this.dispatchEvent(new CustomEvent('socket-event', { detail: msg }))
        break
      case 'owner-status': // owner → everyone: connection state changed
        this.dispatchEvent(new CustomEvent('owner-status', { detail: msg }))
        break
      case 'emit-request': // satellite → owner: please emit on the socket
        this.dispatchEvent(new CustomEvent('emit-request', { detail: msg }))
        break
      case 'emit-ack': // owner → satellite: ack for a prior emit-request
        this._ackWaiters.get(msg.reqId)?.(msg.ack)
        this._ackWaiters.delete(msg.reqId)
        break
      default:
        break
    }
  }

  // ---- owner API ----
  fanoutSocketEvent(event, args) {
    this._post({ type: 'socket-event', event, args })
  }

  broadcastOwnerStatus(status) {
    this._post({ type: 'owner-status', ...status })
    // Also update the owner's OWN UI — it ignores its own bus messages.
    this.dispatchEvent(new CustomEvent('owner-status', { detail: status }))
  }

  replyEmitAck(reqId, ack) {
    this._post({ type: 'emit-ack', reqId, ack })
  }

  // ---- satellite API ----
  // Ask the owner to emit on the shared socket; resolves with the server ack.
  requestEmit(event, payload) {
    const reqId = rand()
    return new Promise((resolve) => {
      this._ackWaiters.set(reqId, resolve)
      this._post({ type: 'emit-request', reqId, event, payload })
      setTimeout(() => {
        if (this._ackWaiters.has(reqId)) {
          this._ackWaiters.delete(reqId)
          resolve({ timeout: true })
        }
      }, 8000)
    })
  }

  close() {
    this._abort.abort() // cancel a still-pending lock request
    this._releaseLock?.() // release the lock if we were the owner → promotes a waiter
    this._releaseLock = null
    this.channel.close()
  }
}
