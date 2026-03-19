import { useState, useEffect } from 'react'
import { Flame, MoonStar, PartyPopper, RotateCcw } from 'lucide-react'
import { generateTemplate, evaluateExpression, MAX_LEVEL, CORRECT_TO_ADVANCE } from './logic/generator'
import { playCorrect, playWrong, playLevelUp, playClick } from './logic/sound'
import SymbolCard from './components/SymbolCard'
import ExpressionDisplay from './components/ExpressionDisplay'
import SymbolLegend from './components/SymbolLegend'
import AnswerInput from './components/AnswerInput'
import Feedback from './components/Feedback'
import Confetti from './components/Confetti'
import TitleScreen from './components/TitleScreen'


function initValues(symbols) {
  return Object.fromEntries(symbols.map(s => [s, 1]))
}

export default function App() {
  // Load persisted progress from localStorage
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem('mathclub_progress')) || {} } catch { return {} }
  })()

  const [level, setLevel] = useState(saved.level || 1)
  const [correctCount, setCorrectCount] = useState(saved.correctCount || 0)
  const [streak, setStreak] = useState(saved.streak || 0)
  const [template, setTemplate] = useState(() => generateTemplate(saved.level || 1))
  const [phase, setPhase] = useState('setting')
  const [userValues, setUserValues] = useState(() => initValues(generateTemplate(saved.level || 1).symbols))
  const [userAnswer, setUserAnswer] = useState(0)
  const [correctAnswer, setCorrectAnswer] = useState(null)
  const [confetti, setConfetti] = useState(false)
  const [shakeBtn, setShakeBtn] = useState(false)
  const [levelUpMsg, setLevelUpMsg] = useState(false)
  const [negativeWarning, setNegativeWarning] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [screen, setScreen] = useState(saved.level ? 'game' : 'title')

  useEffect(() => {
    setUserValues(initValues(template.symbols))
    setUserAnswer(0)
    setCorrectAnswer(null)
    setPhase('setting')
  }, [template])

  // Persist progress whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('mathclub_progress', JSON.stringify({ level, correctCount, streak }))
    } catch { /* storage unavailable */ }
  }, [level, correctCount, streak])

  function loadNewPuzzle(lvl) {
    setTemplate(generateTemplate(lvl))
  }

  function handleLockIn() {
    const result = evaluateExpression(template.terms, userValues)
    if (result < 0) {
      setNegativeWarning(true)
      playWrong()
      return
    }
    playClick()
    setUserAnswer(0)
    setPhase('guessing')
  }

  function handleCheck() {
    const real = evaluateExpression(template.terms, userValues)
    setCorrectAnswer(real)
    if (userAnswer === real) {
      setPhase('correct')
      setStreak(s => s + 1)
      setConfetti(true)
      playCorrect()
      const newCount = correctCount + 1
      if (newCount >= CORRECT_TO_ADVANCE && level < MAX_LEVEL) {
        setCorrectCount(0)
        setTimeout(() => {
          const nextLevel = level + 1
          setLevel(nextLevel)
          loadNewPuzzle(nextLevel)
          setLevelUpMsg(true)
          playLevelUp()
          setTimeout(() => setLevelUpMsg(false), 2500)
        }, 1400)
      } else {
        setCorrectCount(newCount < CORRECT_TO_ADVANCE ? newCount : correctCount)
      }
    } else {
      setPhase('wrong')
      setStreak(0)
      setShakeBtn(true)
      playWrong()
      setTimeout(() => setShakeBtn(false), 500)
    }
  }

  function handleNext() { loadNewPuzzle(level) }

  function handleTryAgain() {
    setPhase('guessing')
    setUserAnswer(0)
    setCorrectAnswer(null)
  }

  function handleSymbolChange(sym, val) {
    setUserValues(v => ({ ...v, [sym]: val }))
    setNegativeWarning(false)
  }

  function handleReset() {
    try { localStorage.removeItem('mathclub_progress') } catch { /* ignore */ }
    setShowResetConfirm(false)
    setLevel(1)
    setCorrectCount(0)
    setStreak(0)
    setTemplate(generateTemplate(1))
    setScreen('title')
  }

  const { symbols, terms } = template
  const progressDots = Array.from({ length: CORRECT_TO_ADVANCE }, (_, i) => i < correctCount)

  const phaseConfig = {
    setting:  { label: 'Lock In!  →', action: handleLockIn,   color: '#FF8C42', shadow: '#C05000' },
    guessing: { label: 'Check!',      action: handleCheck,    color: '#4B9FFF', shadow: '#1A6FAF' },
    correct:  { label: 'Next  →',    action: handleNext,     color: '#56C596', shadow: '#268C56' },
    wrong:    { label: 'Try Again',   action: handleTryAgain, color: '#FF8C42', shadow: '#C05000' },
  }
  const cta = phaseConfig[phase]

  const phaseLabel = {
    setting:  'Pick your numbers',
    guessing: 'What is the answer?',
    correct:  'Correct!',
    wrong:    'Almost!',
  }[phase]

  if (screen === 'title') {
    return <TitleScreen onPlay={() => setScreen('game')} />
  }

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ fontFamily: 'Nunito, sans-serif', backgroundColor: '#FFFBF0' }}
    >
      <Confetti active={confetti} key={String(confetti)} />

      {/* Level-up banner */}
      {levelUpMsg && (
        <div
          className="fixed inset-x-0 top-0 z-40 flex items-center justify-center gap-3 py-6 animate-bounce-in"
          style={{ background: 'linear-gradient(135deg, #FFD166, #FF8C42)' }}
        >
          <PartyPopper size={36} fill="#fff" color="#fff" strokeWidth={1.5} />
          <p className="text-4xl font-bold text-white drop-shadow" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            Level Up!
          </p>
          <PartyPopper size={36} fill="#fff" color="#fff" strokeWidth={1.5} style={{ transform: 'scaleX(-1)' }} />
        </div>
      )}

      {/* ── HEADER — full width always ── */}
      <header className="flex items-center justify-between px-6 pt-5 pb-2 shrink-0">
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-2xl"
          style={{ background: '#FFF0DC', border: '2.5px solid #FF8C42', boxShadow: '0 3px 0 #FF8C42', filter: 'url(#crayon)' }}
        >
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
          {/* Start Over */}
          <button
            onPointerDown={() => setShowResetConfirm(true)}
            className="flex items-center gap-1 px-3 py-2 rounded-2xl transition-all active:scale-95"
            style={{
              background: '#F5F0FF', border: '2.5px solid #C49BFF',
              boxShadow: '0 3px 0 #7A4BCF', filter: 'url(#crayon)',
            }}
            aria-label="Start over"
          >
            <RotateCcw size={18} color="#7A4BCF" strokeWidth={2.2} />
          </button>

          {/* Streak */}
          <div
            className="flex items-center gap-1 px-4 py-2 rounded-2xl"
            style={{
              background: streak > 0 ? '#FFF0DC' : '#F5F5F0',
              border: `2.5px solid ${streak > 0 ? '#FF8C42' : '#DDD'}`,
              boxShadow: streak > 0 ? '0 3px 0 #FF8C42' : '0 3px 0 #DDD',
              filter: 'url(#crayon)',
            }}
          >
            {streak > 0
              ? <Flame size={22} fill="#FF8C42" color="#C05000" strokeWidth={1.5} />
              : <MoonStar size={22} fill="#C8C0B8" color="#A8A0A0" strokeWidth={1.5} />
            }
            <span className="text-xl font-bold" style={{ fontFamily: 'Fredoka, sans-serif', color: streak > 0 ? '#CC6010' : '#AAA' }}>
              {streak}
            </span>
          </div>
        </div>
      </header>

      {/* ── RESET CONFIRMATION MODAL ── */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)' }}
        >
          <div
            className="animate-bounce-in flex flex-col items-center gap-5 px-10 py-8 rounded-3xl mx-6"
            style={{
              backgroundColor: '#FFFBF0',
              border: '3px solid #FF8C42',
              boxShadow: '0 8px 0 #C05000, 0 12px 40px rgba(0,0,0,0.2)',
              filter: 'url(#crayon)',
              maxWidth: 360,
            }}
          >
            <RotateCcw size={40} color="#C05000" strokeWidth={2} />
            <p className="text-3xl font-bold text-center text-stone-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Start over from Level 1?
            </p>
            <p className="text-lg text-stone-400 text-center" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Your progress will be reset.
            </p>
            <div className="flex gap-4 w-full">
              <button
                onPointerDown={() => setShowResetConfirm(false)}
                className="btn-crayon flex-1 py-4 rounded-2xl text-2xl font-bold text-stone-600 active:scale-95"
                style={{
                  fontFamily: 'Fredoka, sans-serif',
                  background: '#F0EDE8',
                  boxShadow: '0 4px 0 #C0BCB8',
                }}
              >
                No
              </button>
              <button
                onPointerDown={handleReset}
                className="btn-crayon flex-1 py-4 rounded-2xl text-2xl font-bold text-white active:scale-95"
                style={{
                  fontFamily: 'Fredoka, sans-serif',
                  background: 'linear-gradient(135deg, #FF8C42, #C05000)',
                  boxShadow: '0 4px 0 #903000',
                }}
              >
                Yes!
              </button>
            </div>
          </div>
        </div>
      )}

      {/*
        ── MAIN CONTENT ──
        Portrait  : single column (flex-col)
        Landscape : two columns — left = expression, right = controls
      */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

        {/* ── LEFT / TOP: expression + legend ── */}
        <div className="flex flex-col items-center justify-center gap-4
                        px-6 py-5
                        md:flex-1 md:border-r md:border-stone-200 md:py-8">
          <p
            className="text-base uppercase tracking-widest text-stone-400"
            style={{ fontFamily: 'Fredoka, sans-serif', letterSpacing: '0.15em' }}
          >
            {phaseLabel}
          </p>

          <ExpressionDisplay terms={terms} symbols={symbols} />

          {phase !== 'setting' && (
            <SymbolLegend symbols={symbols} userValues={userValues} />
          )}
        </div>

        {/* ── RIGHT / BOTTOM: controls + CTA ── */}
        <div className="flex flex-col items-center justify-center gap-6
                        px-6 pb-10 pt-4
                        md:flex-1 md:py-8">

          {phase === 'setting' && (
            <div className="flex flex-row items-end justify-center gap-6 flex-wrap">
              {symbols.map(id => (
                <SymbolCard
                  key={id}
                  id={id}
                  value={userValues[id] ?? 1}
                  onChange={val => handleSymbolChange(id, val)}
                  disabled={false}
                />
              ))}
            </div>
          )}

          {phase === 'guessing' && (
            <AnswerInput value={userAnswer} onChange={setUserAnswer} disabled={false} />
          )}

          {(phase === 'correct' || phase === 'wrong') && (
            <Feedback phase={phase} userAnswer={userAnswer} correctAnswer={correctAnswer} />
          )}

          {negativeWarning && (
            <div className="animate-pop-up px-6 py-3 rounded-2xl border-2 border-red-300 bg-red-50 text-center">
              <p className="text-xl font-bold text-red-500" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                That gives a negative answer!
              </p>
              <p className="text-base text-red-400" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Try bigger numbers for the + symbols,<br />or smaller numbers after the − symbols
              </p>
            </div>
          )}

          <button
            onPointerDown={cta.action}
            className={`btn-crayon px-16 py-5 rounded-3xl text-4xl text-white font-bold tracking-wide ${
              shakeBtn ? 'animate-shake' : ''
            } ${phase === 'correct' ? 'animate-wiggle' : ''} ${negativeWarning ? 'animate-shake' : ''}`}
            style={{
              fontFamily: 'Fredoka, sans-serif',
              background: `linear-gradient(135deg, ${cta.color}, ${cta.shadow})`,
              boxShadow: `0 6px 0 ${cta.shadow}, 0 8px 24px ${cta.color}55`,
            }}
          >
            {cta.label}
          </button>
        </div>
      </div>
    </div>
  )
}
