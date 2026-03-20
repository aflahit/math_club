import { getSymbol, SymbolIcon } from '../symbols.jsx'
import { playClick } from '../logic/sound'
import { useLongPress } from '../logic/useLongPress'

export default function SymbolCard({ id, value, onChange, disabled }) {
  const { bg, border, stroke } = getSymbol(id)

  const incPress = useLongPress(
    () => { if (!disabled && value < 20) onChange(value + 1) },
    { onStart: playClick }
  )
  const decPress = useLongPress(
    () => { if (!disabled && value > 1) onChange(value - 1) },
    { onStart: playClick }
  )

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <SymbolIcon id={id} size={52} />

      <div
        className="flex flex-col items-center rounded-3xl overflow-hidden"
        style={{
          backgroundColor: bg,
          border: `3px solid ${border}`,
          boxShadow: `0 4px 0 ${stroke}, 0 6px 16px ${border}55`,
          minWidth: 88,
          filter: 'url(#crayon)',
        }}
      >
        <button
          {...incPress}
          disabled={disabled || value >= 20}
          className="w-full py-3 text-3xl leading-none font-bold text-white active:scale-95 transition-all disabled:opacity-30"
          style={{ backgroundColor: border, fontFamily: 'Fredoka, sans-serif' }}
          aria-label="Increase"
        >
          ▲
        </button>

        <div
          className="py-3 px-4 text-4xl font-bold w-full text-center leading-none"
          style={{ fontFamily: 'Fredoka, sans-serif', color: stroke }}
        >
          {value}
        </div>

        <button
          {...decPress}
          disabled={disabled || value <= 1}
          className="w-full py-3 text-3xl leading-none font-bold text-white active:scale-95 transition-all disabled:opacity-30"
          style={{ backgroundColor: border, fontFamily: 'Fredoka, sans-serif' }}
          aria-label="Decrease"
        >
          ▼
        </button>
      </div>
    </div>
  )
}
