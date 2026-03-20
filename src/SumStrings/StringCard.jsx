import { useLongPress } from '../logic/useLongPress'
import { playClick } from '../logic/sound'

const COLORS = [
  { bg: '#FFF0DC', border: '#FF8C42', text: '#CC6010', shadow: '#C05000' },
  { bg: '#DCF0FF', border: '#4B9FFF', text: '#1A6FDF', shadow: '#1A6FAF' },
  { bg: '#DCFFF0', border: '#56C596', text: '#268C66', shadow: '#268C56' },
  { bg: '#F0DCFF', border: '#B27BFF', text: '#824BCF', shadow: '#7A4BCF' },
  { bg: '#FFDCDC', border: '#FF7B7B', text: '#CF1B1B', shadow: '#AF1B1B' },
  { bg: '#FFE8F4', border: '#FF9FD0', text: '#CF3E84', shadow: '#AF2E64' },
]

const STRING_HEIGHT = 24 // px

/** A card hanging from the rope */
export default function StringCard({ value, index, isKnown, userValue, onChange, checked, isCorrect, disabled }) {
  const colors = COLORS[index % COLORS.length]

  const incPress = useLongPress(
    () => { if (!disabled && userValue < 1000) onChange(userValue + 1) },
    { onStart: disabled ? undefined : playClick }
  )
  const decPress = useLongPress(
    () => { if (!disabled && userValue > 0) onChange(userValue - 1) },
    { onStart: disabled ? undefined : playClick }
  )

  // The thin hanging string
  const StringLine = () => (
    <div style={{ width: 3, height: STRING_HEIGHT, backgroundColor: '#92400e', margin: '0 auto' }} />
  )

  if (isKnown) {
    return (
      <div className="flex flex-col items-center shrink-0">
        <StringLine />
        <div
          className="flex items-center justify-center rounded-2xl px-4 py-3"
          style={{
            backgroundColor: colors.bg,
            border: `3px solid ${colors.border}`,
            boxShadow: `0 4px 0 ${colors.shadow}`,
            minWidth: 72,
            filter: 'url(#crayon)',
          }}
        >
          <span
            className="font-bold leading-none"
            style={{
              fontFamily: 'Fredoka, sans-serif',
              color: colors.text,
              fontSize: value >= 100 ? '1.4rem' : '1.875rem',
            }}
          >
            {value}
          </span>
        </div>
      </div>
    )
  }

  // Determine border color based on check result
  let borderColor = '#CBD5E1'
  let bgColor = '#F8FAFC'
  let shadowColor = '#94A3B8'
  if (checked) {
    borderColor = isCorrect ? '#56C596' : '#FF7B7B'
    bgColor     = isCorrect ? '#DCFFF0' : '#FFDCDC'
    shadowColor = isCorrect ? '#268C56' : '#CF1B1B'
  }

  return (
    <div className="flex flex-col items-center shrink-0">
      <StringLine />
      <div
        className="flex flex-col items-center rounded-2xl overflow-hidden"
        style={{
          backgroundColor: bgColor,
          border: `3px solid ${borderColor}`,
          boxShadow: `0 4px 0 ${shadowColor}`,
          minWidth: 72,
          filter: 'url(#crayon)',
          transition: 'background-color 0.2s, border-color 0.2s',
        }}
      >
        <button
          {...incPress}
          disabled={disabled}
          className="w-full py-2 text-xl font-bold text-white active:scale-95 transition-all disabled:opacity-40"
          style={{ backgroundColor: borderColor, fontFamily: 'Fredoka, sans-serif' }}
        >
          ▲
        </button>
        <div
          className="py-2 px-3 font-bold text-center leading-none"
          style={{
            fontFamily: 'Fredoka, sans-serif',
            color: checked ? (isCorrect ? '#268C66' : '#CF1B1B') : '#64748B',
            fontSize: userValue >= 100 ? '1.4rem' : '1.875rem',
          }}
        >
          {userValue}
        </div>
        <button
          {...decPress}
          disabled={disabled}
          className="w-full py-2 text-xl font-bold text-white active:scale-95 transition-all disabled:opacity-40"
          style={{ backgroundColor: borderColor, fontFamily: 'Fredoka, sans-serif' }}
        >
          ▼
        </button>
      </div>
    </div>
  )
}
