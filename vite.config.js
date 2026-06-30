import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Port 5174 is in the dev socket server's CORS allow-list (ALLOW_ACCESS_ORIGIN),
  // so the browser websocket handshake to cncapi-dev.zillit.com is accepted.
  server: { port: 5174, strictPort: true },
})
