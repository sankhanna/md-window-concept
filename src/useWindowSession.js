import { useEffect, useRef, useState } from 'react'
import { WindowBus } from './core/windowBus.js'
import { SocketHub } from './core/socketHub.js'

// One hook per window. Sets up the cross-window bus, elects an owner, and (only
// in the owner window) opens the shared socket. Returns live status + an emit()
// that transparently routes through the owner.
export function useWindowSession() {
  const busRef = useRef(null)
  const hubRef = useRef(null)
  const [role, setRole] = useState('satellite') // 'owner' | 'satellite'
  const [status, setStatus] = useState({ connected: false, socketId: null, ownerId: null })
  const [log, setLog] = useState([])
  const windowIdRef = useRef(null)

  useEffect(() => {
    const bus = new WindowBus()
    busRef.current = bus
    windowIdRef.current = bus.windowId

    const append = (event, args) =>
      setLog((prev) =>
        [{ id: `${Date.now()}-${Math.random()}`, t: new Date(), event, args }, ...prev].slice(0, 60),
      )

    bus.addEventListener('role', (e) => {
      if (e.detail.isOwner) setRole('owner')
    })
    bus.addEventListener('socket-event', (e) => append(e.detail.event, e.detail.args))
    bus.addEventListener('owner-status', (e) =>
      setStatus({
        connected: !!e.detail.connected,
        socketId: e.detail.socketId || null,
        ownerId: e.detail.ownerId || null,
      }),
    )

    bus.start(() => {
      // This window won the lock → become the socket owner.
      const hub = new SocketHub(bus)
      hubRef.current = hub
      hub.connect()
      setStatus((s) => ({ ...s, ownerId: bus.windowId }))
    })

    return () => bus.close()
  }, [])

  // Emit through the single socket regardless of which window we are.
  const emit = async (event, payload) => {
    if (role === 'owner' && hubRef.current?.socket) {
      hubRef.current.socket.emit(event, payload, null, () => {})
      return { ok: true, via: 'owner' }
    }
    return busRef.current.requestEmit(event, payload)
  }

  const popOut = (moduleKey) => {
    const url = `${location.pathname}?module=${encodeURIComponent(moduleKey)}`
    window.open(url, `zillit-${moduleKey}`, 'width=560,height=680,menubar=no,toolbar=no')
  }

  return { role, status, log, emit, popOut, windowId: windowIdRef.current }
}
