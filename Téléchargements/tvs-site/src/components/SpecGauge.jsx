// Élément signature : un cadran façon compte-tours pour mettre en avant
// une caractéristique clé (vitesse max, puissance...) — clin d'œil à l'univers moto.

const SIZE = 128
const STROKE = 10
const RADIUS = (SIZE - STROKE) / 2
const ARC_DEGREES = 260 // arc ouvert, façon compteur de moto
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const ARC_LENGTH = (ARC_DEGREES / 360) * CIRCUMFERENCE

export default function SpecGauge({ value, max, unit, label }) {
  const ratio = Math.min(1, Math.max(0, value / max))
  const filled = ratio * ARC_LENGTH
  const rotation = -(ARC_DEGREES / 2) - 90 // centre l'ouverture en bas

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--color-line)"
            strokeWidth={STROKE}
            strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
            strokeLinecap="round"
            transform={`rotate(${rotation} ${SIZE / 2} ${SIZE / 2})`}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--color-tvs-red)"
            strokeWidth={STROKE}
            strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
            strokeLinecap="round"
            transform={`rotate(${rotation} ${SIZE / 2} ${SIZE / 2})`}
            style={{ transition: 'stroke-dasharray 700ms ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-bold leading-none text-ink">{value}</span>
          <span className="font-mono text-[10px] uppercase tracking-wide text-steel">{unit}</span>
        </div>
      </div>
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-steel">{label}</span>
    </div>
  )
}
