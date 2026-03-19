import { getSymbol, SymbolIcon } from '../symbols'
import { playClick } from '../logic/sound'

export default function SymbolCard({ id, index, value, onChange, disabled }) {
  const { bg, border, stroke } = getSymbol(id)

  function inc() {
    if (disabled || value >= 20) return
    playClick()
    onChange(value + 1)
  }
  function dec() {
    if (disabled || value <= 1) return
    playClick()
    onChange(value - 1)
  }

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
          onPointerDown={inc}
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
          onPointerDown={dec}
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
