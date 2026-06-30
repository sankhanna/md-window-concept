// Stepper — the progress header for a multistep dialog.
export default function Stepper({ steps, current }) {
  return (
    <div className="stepper">
      {steps.map((s, i) => (
        <div key={s} className={`stepper__step ${i === current ? 'is-active' : ''} ${i < current ? 'is-done' : ''}`}>
          <span className="stepper__num">{i < current ? '✓' : i + 1}</span>
          <span className="stepper__label">{s}</span>
          {i < steps.length - 1 && <span className="stepper__bar" />}
        </div>
      ))}
    </div>
  )
}
