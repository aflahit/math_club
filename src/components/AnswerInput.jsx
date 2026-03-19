import { playClick } from '../logic/sound'

export default function AnswerInput({ value, onChange, disabled }) {
  function inc() {
    if (disabled || value >= 40) return
    playClick()
    onChange(value + 1)
  }
  function dec() {
    if (disabled || value <= 0) return
    playClick()
    onChange(value - 1)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <p
        className="text-lg text-stone-400 uppercase tracking-widest"
        style={{ fontFamily: 'Fredoka, sans-serif', letterSpacing: '0.12em' }}
      >
        Your answer
      </p>

      <div
        className="flex flex-col items-center rounded-3xl overflow-hidden"
        style={{
          backgroundColor: '#F0DCFF',
          border: '3px solid #B27BFF',
          boxShadow: '0 4px 0 #925BDF, 0 6px 20px #B27BFF44',
          minWidth: 110,
          filter: 'url(#crayon)',
        }}
      >
        {/* Up */}
        <button
          onPointerDown={inc}
          disabled={disabled}
          className="w-full py-3 text-3xl leading-none text-white font-bold active:scale-95 transition-all disabled:opacity-30"
          style={{ backgroundColor: '#B27BFF', fontFamily: 'Fredoka, sans-serif' }}
          aria-label="Increase answer"
        >
          ▲
        </button>

        {/* Value */}
        <div
          className="py-3 px-6 text-5xl font-bold text-center leading-none"
          style={{ fontFamily: 'Fredoka, sans-serif', color: '#824BCF' }}
        >
          {value}
        </div>

        {/* Down */}
        <button
          onPointerDown={dec}
          disabled={disabled}
          className="w-full py-3 text-3xl leading-none text-white font-bold active:scale-95 transition-all disabled:opacity-30"
          style={{ backgroundColor: '#B27BFF', fontFamily: 'Fredoka, sans-serif' }}
          aria-label="Decrease answer"
        >
          ▼
        </button>
      </div>
    </div>
  )
}
