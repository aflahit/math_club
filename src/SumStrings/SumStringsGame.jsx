import { useState, useEffect } from 'react'
import { Flame, MoonStar, PartyPopper, RotateCcw, Home } from 'lucide-react'
import { generatePuzzle, SS_MAX_LEVEL, SS_CORRECT_TO_ADVANCE } from './generator'
import StringCard from './StringCard'
import RaceCar from './RaceCar'
import Confetti from '../components/Confetti'
import { playCorrect, playWrong, playLevelUp, playClick } from '../logic/sound'

export default function SumStringsGame({ onExit, onWin }) {
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem('mathclub_ss_progress')) || {} } catch { return {} }
  })()

  const [level, setLevel]               = useState(saved.level || 1)
  const [correctCount, setCorrectCount] = useState(saved.correctCount || 0)
  const [streak, setStreak]             = useState(saved.streak || 0)
  const [puzzle, setPuzzle]             = useState(() => generatePuzzle(saved.level || 1))
  const [userValues, setUserValues]     = useState({})
  const [phase, setPhase]               = useState('playing') // playing | correct | wrong
  const [wrongCount, setWrongCount]     = useState(0)
  const [confetti, setConfetti]         = useState(false)
  const [levelUpMsg, setLevelUpMsg]     = useState(false)
  const [checkedCards, setCheckedCards] = useState(null) // null | bool[]
  const [birdFlips, setBirdFlips]       = useState([])
  const [carColorIndex, setCarColorIndex] = useState(0)
  const [showCar, setShowCar]             = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showHomeConfirm, setShowHomeConfirm]   = useState(false)

  const { seq, knownIndices } = puzzle
  const blankIndices = seq.map((_, i) => i).filter(i => !knownIndices.includes(i))
  const progressDots = Array.from({ length: SS_CORRECT_TO_ADVANCE }, (_, i) => i < correctCount)

  useEffect(() => {
    const init = {}
    blankIndices.forEach(i => { init[i] = 0 })
    setUserValues(init)
    setPhase('playing')
    setWrongCount(0)
    setCheckedCards(null)
  }, [puzzle])

  useEffect(() => {
    try {
      localStorage.setItem('mathclub_ss_progress', JSON.stringify({ level, correctCount, streak }))
    } catch {}
  }, [level, correctCount, streak])

  function handleCheck() {
    const cardResults = seq.map((val, i) => {
      if (knownIndices.includes(i)) return true
      return userValues[i] === val
    })
    setCheckedCards(cardResults)

    const allCorrect = blankIndices.every(i => userValues[i] === seq[i])

    if (allCorrect) {
      setPhase('correct')
      setStreak(s => s + 1)
      setConfetti(true)
      setBirdFlips(seq.map(() => Math.random() < 0.5))
      setCarColorIndex(Math.floor(Math.random() * 6))
      setShowCar(true)
      playCorrect()

      const newCount = correctCount + 1
      if (newCount >= SS_CORRECT_TO_ADVANCE) {
        setCorrectCount(0)
        if (level >= SS_MAX_LEVEL) {
          setTimeout(() => onWin?.(), 1400)
        } else {
          setTimeout(() => {
            const nextLevel = level + 1
            setLevel(nextLevel)
            setPuzzle(generatePuzzle(nextLevel, puzzle.seq))
            setLevelUpMsg(true)
            playLevelUp()
            setTimeout(() => setLevelUpMsg(false), 2500)
          }, 1400)
        }
      } else {
        setCorrectCount(newCount)
      }
    } else {
      setPhase('wrong')
      setStreak(0)
      setWrongCount(c => c + 1)
      playWrong()
    }
  }

  function handleNext() {
    playClick()
    setConfetti(false)
    setPuzzle(generatePuzzle(level, puzzle.seq))
  }

  function handleTryAgain() {
    playClick()
    setPhase('playing')
    setCheckedCards(null)
  }

  function handleReset() {
    playClick()
    try { localStorage.setItem('mathclub_ss_progress', '{}') } catch {}
    setShowResetConfirm(false)
    setLevel(1)
    setCorrectCount(0)
    setStreak(0)
    setPuzzle(generatePuzzle(1))
  }

  const correctBlanks = checkedCards ? blankIndices.filter(i => checkedCards[i]).length : 0
  const showHint = wrongCount >= 3

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ fontFamily: 'Nunito, sans-serif', backgroundColor: '#FFFBF0' }}>

      <Confetti active={confetti} key={String(confetti)} />

      {levelUpMsg && (
        <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-center gap-3 py-6 animate-bounce-in"
          style={{ background: 'linear-gradient(135deg, #FFD166, #FF8C42)' }}>
          <PartyPopper size={36} fill="#fff" color="#fff" strokeWidth={1.5} />
          <p className="text-4xl font-bold text-white drop-shadow" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            Level Up!
          </p>
          <PartyPopper size={36} fill="#fff" color="#fff" strokeWidth={1.5} style={{ transform: 'scaleX(-1)' }} />
        </div>
      )}

      {/* ── HEADER ── */}
      <header className="flex items-center justify-between px-6 pt-5 pb-2 shrink-0">
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl"
          style={{ background: '#FFF0DC', border: '2.5px solid #FF8C42', boxShadow: '0 3px 0 #FF8C42', filter: 'url(#crayon)' }}>
          <span className="text-xl font-bold" style={{ fontFamily: 'Fredoka, sans-serif', color: '#CC6010' }}>
            Level {level}
          </span>
          <div className="flex gap-1 ml-1">
            {progressDots.map((filled, i) => (
              <div key={i} className="w-3 h-3 rounded-full transition-all duration-300"
                style={{ backgroundColor: filled ? '#FF8C42' : '#FFD9B0' }} />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onPointerDown={() => { playClick(); setShowHomeConfirm(true) }}
            className="flex items-center gap-1 px-3 py-2 rounded-2xl transition-all active:scale-95"
            style={{ background: '#F5F0FF', border: '2.5px solid #C49BFF', boxShadow: '0 3px 0 #7A4BCF', filter: 'url(#crayon)' }}>
            <Home size={18} color="#7A4BCF" strokeWidth={2.2} />
          </button>

          <button
            onPointerDown={() => { playClick(); setShowResetConfirm(true) }}
            className="flex items-center gap-1 px-3 py-2 rounded-2xl transition-all active:scale-95"
            style={{ background: '#F5F0FF', border: '2.5px solid #C49BFF', boxShadow: '0 3px 0 #7A4BCF', filter: 'url(#crayon)' }}>
            <RotateCcw size={18} color="#7A4BCF" strokeWidth={2.2} />
          </button>

          <div className="flex items-center gap-1 px-4 py-2 rounded-2xl"
            style={{
              background: streak > 0 ? '#FFF0DC' : '#F5F5F0',
              border: `2.5px solid ${streak > 0 ? '#FF8C42' : '#DDD'}`,
              boxShadow: streak > 0 ? '0 3px 0 #FF8C42' : '0 3px 0 #DDD',
              filter: 'url(#crayon)',
            }}>
            {streak > 0
              ? <Flame    size={22} fill="#FF8C42" color="#C05000" strokeWidth={1.5} />
              : <MoonStar size={22} fill="#C8C0B8" color="#A8A0A0" strokeWidth={1.5} />
            }
            <span className="text-xl font-bold" style={{ fontFamily: 'Fredoka, sans-serif', color: streak > 0 ? '#CC6010' : '#AAA' }}>
              {streak}
            </span>
          </div>
        </div>
      </header>

      {/* ── HOME MODAL ── */}
      {showHomeConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)' }}>
          <div className="animate-bounce-in flex flex-col items-center gap-5 px-10 py-8 rounded-3xl mx-6"
            style={{
              backgroundColor: '#FFFBF0', border: '3px solid #C49BFF',
              boxShadow: '0 8px 0 #7A4BCF, 0 12px 40px rgba(0,0,0,0.2)',
              filter: 'url(#crayon)', maxWidth: 360,
            }}>
            <Home size={40} color="#7A4BCF" strokeWidth={2} />
            <p className="text-3xl font-bold text-center text-stone-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Go back to game select?
            </p>
            <p className="text-lg text-stone-400 text-center">Your level progress is saved.</p>
            <div className="flex gap-4 w-full">
              <button
                onPointerDown={() => { playClick(); setShowHomeConfirm(false) }}
                className="flex-1 py-4 rounded-2xl text-2xl font-bold text-stone-600 active:scale-95"
                style={{ fontFamily: 'Fredoka, sans-serif', background: '#F0EDE8', boxShadow: '0 4px 0 #C0BCB8' }}>
                No
              </button>
              <button
                onPointerDown={() => { playClick(); setShowHomeConfirm(false); onExit?.() }}
                className="flex-1 py-4 rounded-2xl text-2xl font-bold text-white active:scale-95"
                style={{ fontFamily: 'Fredoka, sans-serif', background: 'linear-gradient(135deg, #B27BFF, #7A4BCF)', boxShadow: '0 4px 0 #5A2BAF' }}>
                Yes!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── RESET MODAL ── */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)' }}>
          <div className="animate-bounce-in flex flex-col items-center gap-5 px-10 py-8 rounded-3xl mx-6"
            style={{
              backgroundColor: '#FFFBF0', border: '3px solid #FF8C42',
              boxShadow: '0 8px 0 #C05000, 0 12px 40px rgba(0,0,0,0.2)',
              filter: 'url(#crayon)', maxWidth: 360,
            }}>
            <RotateCcw size={40} color="#C05000" strokeWidth={2} />
            <p className="text-3xl font-bold text-center text-stone-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Start over from Level 1?
            </p>
            <p className="text-lg text-stone-400 text-center">Your progress will be reset.</p>
            <div className="flex gap-4 w-full">
              <button
                onPointerDown={() => { playClick(); setShowResetConfirm(false) }}
                className="flex-1 py-4 rounded-2xl text-2xl font-bold text-stone-600 active:scale-95"
                style={{ fontFamily: 'Fredoka, sans-serif', background: '#F0EDE8', boxShadow: '0 4px 0 #C0BCB8' }}>
                No
              </button>
              <button
                onPointerDown={handleReset}
                className="flex-1 py-4 rounded-2xl text-2xl font-bold text-white active:scale-95"
                style={{ fontFamily: 'Fredoka, sans-serif', background: 'linear-gradient(135deg, #FF8C42, #C05000)', boxShadow: '0 4px 0 #903000' }}>
                Yes!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-4 pb-8 overflow-hidden">

        <p className="text-base uppercase tracking-widest text-stone-400"
          style={{ fontFamily: 'Fredoka, sans-serif', letterSpacing: '0.15em' }}>
          {phase === 'correct' ? 'All correct!' : phase === 'wrong' ? 'Almost!' : 'Fill in the blanks!'}
        </p>

        {/* Rope + Cards */}
        <div className="relative w-full flex justify-center">
          {/* Horizontal rope */}
          <div className="absolute left-6 right-6 z-20"
            style={{
              top: 0,
              height: 10,
              background: 'repeating-linear-gradient(90deg, #92400e 0px, #78350f 8px, #92400e 16px)',
              borderRadius: 5,
              boxShadow: '0 3px 6px rgba(0,0,0,0.25)',
            }}
          />
          {/* Cards */}
          <div className="relative z-10 flex items-start justify-center gap-3 flex-wrap px-8">
            {seq.map((val, i) => (
              <StringCard
                key={i}
                value={val}
                index={i}
                isKnown={knownIndices.includes(i)}
                userValue={userValues[i] ?? 0}
                onChange={newVal => setUserValues(v => ({ ...v, [i]: newVal }))}
                checked={checkedCards !== null && !knownIndices.includes(i)}
                isCorrect={checkedCards ? checkedCards[i] : false}
                disabled={phase !== 'playing'}
                showBird={phase === 'correct'}
                birdDelay={i * 0.1}
                birdFlip={birdFlips[i] ?? false}
              />
            ))}
          </div>
        </div>

        {/* Pattern hint */}
        <p className="text-sm text-stone-300 text-center" style={{ fontFamily: 'Nunito, sans-serif' }}>
          {level >= 11
            ? 'Tip: subtract two neighbours to work backwards!'
            : 'Each number = sum of the two before it'}
        </p>

        {/* Feedback */}
        {phase === 'correct' && (
          <div className="animate-pop-up flex flex-col items-center gap-1 py-3 px-8 rounded-3xl bg-emerald-100 border-2 border-emerald-400">
            <PartyPopper size={48} fill="#FFD166" color="#E08800" strokeWidth={1.6} className="animate-bounce-in" />
            <p className="text-3xl font-bold text-emerald-600" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              That's right!
            </p>
          </div>
        )}

        {phase === 'wrong' && (
          <div className="animate-pop-up flex flex-col items-center gap-1 py-3 px-8 rounded-3xl bg-orange-50 border-2 border-orange-300">
            <p className="text-2xl font-bold text-orange-500" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Not quite!
            </p>
            {showHint ? (
              <p className="text-lg text-stone-500 text-center" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {correctBlanks} of {blankIndices.length} correct — check the red cards
              </p>
            ) : (
              <p className="text-base text-stone-400" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Try again!
              </p>
            )}
          </div>
        )}

        {/* CTA Button */}
        {phase === 'playing' && (
          <button
            onPointerDown={handleCheck}
            className="px-16 py-5 rounded-3xl text-4xl text-white font-bold tracking-wide active:scale-95 transition-all"
            style={{
              fontFamily: 'Fredoka, sans-serif',
              background: 'linear-gradient(135deg, #4B9FFF, #1A6FAF)',
              boxShadow: '0 6px 0 #1A6FAF, 0 8px 24px #4B9FFF55',
              filter: 'url(#crayon)',
            }}
          >
            Check!
          </button>
        )}

        {phase === 'correct' && (
          <button
            onPointerDown={handleNext}
            className="px-16 py-5 rounded-3xl text-4xl text-white font-bold tracking-wide active:scale-95 transition-all animate-wiggle"
            style={{
              fontFamily: 'Fredoka, sans-serif',
              background: 'linear-gradient(135deg, #56C596, #268C56)',
              boxShadow: '0 6px 0 #268C56, 0 8px 24px #56C59655',
              filter: 'url(#crayon)',
            }}
          >
            Next  →
          </button>
        )}

        {phase === 'wrong' && (
          <button
            onPointerDown={handleTryAgain}
            className="px-16 py-5 rounded-3xl text-4xl text-white font-bold tracking-wide active:scale-95 transition-all"
            style={{
              fontFamily: 'Fredoka, sans-serif',
              background: 'linear-gradient(135deg, #FF8C42, #C05000)',
              boxShadow: '0 6px 0 #C05000, 0 8px 24px #FF8C4255',
              filter: 'url(#crayon)',
            }}
          >
            Try Again
          </button>
        )}
      </div>

      {showCar && <RaceCar colorIndex={carColorIndex} onDone={() => setShowCar(false)} />}
    </div>
  )
}
