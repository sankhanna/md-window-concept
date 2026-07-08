import { MODULE_META } from '../config.js'

// A lightweight placeholder for tools/sections that don't yet have a full
// build-out. It titles itself from the module key so one component serves them all.
export default function GenericSection({ moduleKey }) {
  const meta = MODULE_META[moduleKey] || { label: moduleKey, icon: '📁' }
  return (
    <div className="mod mod-generic">
      <div className="mod-scroll">
        <div className="generic">
          <div className="generic__icon">{meta.icon}</div>
          <div className="generic__title">{meta.label}</div>
          <p className="generic__note">
            This tool opens as its own window. Content for
            <strong> {meta.label}</strong> would render here in the full build.
          </p>
        </div>
      </div>
    </div>
  )
}
