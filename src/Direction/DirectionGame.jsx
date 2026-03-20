import { useState, useEffect } from 'react'
import { Flame, MoonStar, PartyPopper, RotateCcw, Home } from 'lucide-react'
import { generatePuzzle, computePath, DIR_MAX_LEVEL, DIR_CORRECT_TO_ADVANCE } from './generator'
import Grid from './Grid'
import Confetti from '../components/Confetti'
import { playCorrect, playWrong, playLevelUp, playClick } from '../logic/sound'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function posEq(a, b) {
  if (!a || !b) return false
  return a[0] === b[0] && a[1] === b[1]
}

export default function DirectionGame({ onExit, onWin }) {
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem('mathclub_dir_progress')) || {} } catch { return {} }
  })()

  const [level,        setLevel]        = useState(saved.level        || 1)
  const [correctCount, setCorrectCount] = useState(saved.correctCount || 0)
  const [streak,       setStreak]       = useState(saved.streak       || 0)
  const [puzzle,       setPuzzle]       = useState(() => generatePuzzle(saved.level || 1))

  const [dronePos,     setDronePos]     = useState(() => generatePuzzle(saved.level || 1).start)
  const [selectedCell, setSelectedCell] = useState(null)
  const [trail,        setTrail]        = useState([])
  const [phase,        setPhase]        = useState('predict')
  const [wrongCount,   setWrongCount]   = useState(0)

  const [confetti,     setConfetti]     = useState(false)
  const [levelUpMsg,   setLevelUpMsg]   = useState(false)
  const [showHomeConfirm,  setShowHomeConfirm]  = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Reset state when puzzle changes
  useEffect(() => {
    setDronePos(puzzle.start)
    setSelectedCell(null)
    setTrail([])
    setPhase('predict')
    setWrongCount(0)
  }, [puzzle])

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem('mathclub_dir_progress', JSON.stringify({ level, correctCount, streak }))
    } catch {}
  }, [level, correctCount, streak])

  function handleCellTap(cell) {
    if (phase !== 'predict') return
    setSelectedCell(cell)
    if (puzzle.mode === 'backward') {
      setDronePos(cell)
    }
  }

  async function handleRun() {
    if (!selectedCell) return
    setPhase('running')

    const isBackward = puzzle.mode === 'backward'
    const animStart  = isBackward ? selectedCell : puzzle.start
    const path       = computePath(animStart, puzzle.steps)

    setDronePos(path[0])
    setTrail([path[0]])

    for (let i = 1; i < path.length; i++) {
      await sleep(280)
      setDronePos(path[i])
      setTrail(prev => [...prev, path[i]])
    }

    await sleep(300)

    const finalPos = path[path.length - 1]
    const correct  = isBackward
      ? posEq(finalPos, puzzle.end)
      : posEq(selectedCell, puzzle.end)

    if (correct) {
      setPhase('correct')
      setStreak(s => s + 1)
      setConfetti(true)
      playCorrect()

      const newCount = correctCount + 1
      if (newCount >= DIR_CORRECT_TO_ADVANCE) {
        setCorrectCount(0)
        if (level >= DIR_MAX_LEVEL) {
          setTimeout(() => onWin?.(), 1400)
        } else {
          setTimeout(() => {
            const nextLevel = level + 1
            setLevel(nextLevel)
            setPuzzle(generatePuzzle(nextLevel))
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

  function handleTryAgain() {
    playClick()
    setSelectedCell(null)
    setTrail([])
    if (puzzle.mode === 'backward') {
      setDronePos(puzzle.start)
    } else {
      setDronePos(puzzle.start)
    }
    setPhase('predict')
  }

  function handleNext() {
    playClick()
    setConfetti(false)
    setPuzzle(generatePuzzle(level))
  }

  function handleReset() {
    playClick()
    try { localStorage.setItem('mathclub_dir_progress', '{}') } catch {}
    setShowResetConfirm(false)
    setLevel(1)
    setCorrectCount(0)
    setStreak(0)
    setPuzzle(generatePuzzle(1))
  }

  const progressDots = Array.from({ length: DIR_CORRECT_TO_ADVANCE }, (_, i) => i < correctCount)
  const isBackward   = puzzle.mode === 'backward'
  const showHint     = wrongCount >= 3

  const phaseLabel = {
    predict: isBackward ? 'Tap where it started!' : 'Tap where it will land!',
    running: 'Flying...',
    correct: 'Correct!',
    wrong:   'Not quite!',
  }[phase]

  // For reveal: the correct cell to highlight
  const correctCell = isBackward ? puzzle.start : puzzle.end

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
          style={{ background: '#DCF8F8', border: '2.5px solid #3ECFCF', boxShadow: '0 3px 0 #157A7A', filter: 'url(#crayon)' }}>
          <span className="text-xl font-bold" style={{ fontFamily: 'Fredoka, sans-serif', color: '#157A7A' }}>
            Level {level}
          </span>
          <div className="flex gap-1 ml-1">
            {progressDots.map((filled, i) => (
              <div key={i} className="w-3 h-3 rounded-full transition-all duration-300"
                style={{ backgroundColor: filled ? '#3ECFCF' : '#A8EBEB' }} />
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
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4 pb-6 overflow-hidden">

        {/* Phase label */}
        <p className="text-base uppercase tracking-widest text-stone-400"
          style={{ fontFamily: 'Fredoka, sans-serif', letterSpacing: '0.15em' }}>
          {phaseLabel}
        </p>

        {/* Steps display */}
        <div className="flex flex-row items-center justify-center gap-3 flex-wrap">
          {puzzle.steps.map((step, i) => (
            <div key={i}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl"
              style={{
                background: '#DCF0FF',
                border: '2.5px solid #4B9FFF',
                boxShadow: '0 3px 0 #1A6FAF',
                filter: 'url(#crayon)',
                minWidth: 64,
              }}>
              <span className="text-2xl leading-none" style={{ fontFamily: 'Fredoka, sans-serif' }}>{step.arrow}</span>
              <span className="text-2xl font-bold leading-none" style={{ fontFamily: 'Fredoka, sans-serif', color: '#1A6FAF' }}>{step.count}</span>
            </div>
          ))}
        </div>

        {/* Grid */}
        <Grid
          dronePos={dronePos}
          trail={trail}
          startCell={puzzle.start}
          endCell={puzzle.end}
          selectedCell={selectedCell}
          onCellTap={handleCellTap}
          phase={phase}
          mode={puzzle.mode}
          revealAnswer={phase === 'wrong' && showHint}
          correctCell={correctCell}
        />

        {/* Feedback */}
        {phase === 'correct' && (
          <div className="animate-pop-up flex flex-col items-center gap-1 py-3 px-8 rounded-3xl bg-emerald-100 border-2 border-emerald-400">
            <PartyPopper size={40} fill="#FFD166" color="#E08800" strokeWidth={1.6} className="animate-bounce-in" />
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
              <p className="text-base text-stone-500 text-center" style={{ fontFamily: 'Nunito, sans-serif' }}>
                The {isBackward ? 'start' : 'landing spot'} is highlighted in green!
              </p>
            ) : (
              <p className="text-base text-stone-400" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Try again!
              </p>
            )}
          </div>
        )}

        {/* CTA Buttons */}
        {phase === 'predict' && selectedCell && (
          <button
            onPointerDown={handleRun}
            className="px-16 py-5 rounded-3xl text-4xl text-white font-bold tracking-wide active:scale-95 transition-all"
            style={{
              fontFamily: 'Fredoka, sans-serif',
              background: 'linear-gradient(135deg, #4B9FFF, #1A6FAF)',
              boxShadow: '0 6px 0 #1A6FAF, 0 8px 24px #4B9FFF55',
              filter: 'url(#crayon)',
            }}>
            Run! →
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
            }}>
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
            }}>
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}
