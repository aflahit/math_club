import { PartyPopper } from 'lucide-react'

export default function Feedback({ phase, got, expected, wrongCount = 0 }) {
  if (phase !== 'correct' && phase !== 'wrong') return null
  const isCorrect  = phase === 'correct'
  const showHint   = wrongCount >= 3

  return (
    <div
      className={`animate-pop-up flex flex-col items-center gap-1 py-3 px-8 rounded-3xl ${
        isCorrect
          ? 'bg-emerald-100 border-2 border-emerald-400'
          : 'bg-orange-50 border-2 border-orange-300'
      }`}
    >
      {isCorrect ? (
        <>
          <PartyPopper size={52} fill="#FFD166" color="#E08800" strokeWidth={1.6} className="animate-bounce-in" />
          <p className="text-3xl font-bold text-emerald-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            That's right!
          </p>
          <p className="text-xl text-emerald-500" style={{ fontFamily: 'Nunito, sans-serif' }}>
            = {expected} ✓
          </p>
        </>
      ) : (
        <>
          <p className="text-2xl font-bold text-orange-500" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            Not quite!
          </p>
          {showHint ? (
            <p className="text-lg text-stone-500" style={{ fontFamily: 'Nunito, sans-serif' }}>
              You got <strong>{got}</strong> — looking for <strong>{expected}</strong>
            </p>
          ) : (
            <p className="text-base text-stone-400" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Try again!
            </p>
          )}
        </>
      )}
    </div>
  )
}
