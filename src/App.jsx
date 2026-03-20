import { useState, useEffect } from 'react'
import { Flame, MoonStar, PartyPopper, RotateCcw } from 'lucide-react'
import { generateTemplate, evaluateExpression, MAX_LEVEL, CORRECT_TO_ADVANCE } from './logic/generator'
import { playCorrect, playWrong, playLevelUp, playClick } from './logic/sound'
import SymbolCard from './components/SymbolCard'
import { SymbolIcon } from './symbols.jsx'
import ExpressionDisplay from './components/ExpressionDisplay'
import SymbolLegend from './components/SymbolLegend'
import AnswerInput from './components/AnswerInput'
import Feedback from './components/Feedback'
import Confetti from './components/Confetti'
import TitleScreen from './components/TitleScreen'
import WinScreen from './components/WinScreen'

function initValues(symbols) {
  return Object.fromEntries(symbols.map(s => [s, 1]))
}

export default function App() {
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem('mathclub_progress')) || {} } catch { return {} }
  })()

  const [level, setLevel]               = useState(saved.level || 1)
  const [correctCount, setCorrectCount] = useState(saved.correctCount || 0)
  const [streak, setStreak]             = useState(saved.streak || 0)
  const [template, setTemplate]         = useState(() => generateTemplate(saved.level || 1))
  const [phase, setPhase]               = useState('setting')
  const [userValues, setUserValues]     = useState(() => initValues(generateTemplate(saved.level || 1).symbols))
  const [userAnswer, setUserAnswer]     = useState(0)   // evaluate mode only
  const [gotResult, setGotResult]       = useState(null) // what user got
  const [expectedResult, setExpected]   = useState(null) // what was needed
  const [wrongCount, setWrongCount]     = useState(0)
  const [confetti, setConfetti]         = useState(false)
  const [shakeBtn, setShakeBtn]         = useState(false)
  const [levelUpMsg, setLevelUpMsg]     = useState(false)
  const [negativeWarning, setNegativeWarning] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [screen, setScreen]             = useState(saved.started ? 'game' : 'title')

  // When template changes, reset state
  useEffect(() => {
    const vals = initValues(template.symbols)
    setUserValues(vals)
    setUserAnswer(0)
    setGotResult(null)
    setExpected(null)
    setNegativeWarning(false)
    setWrongCount(0)
    // Target mode with 1 symbol: skip setting phase
    if (template.type === 'target' && template.symbols.length === 1) {
      setPhase('guessing')
    } else {
      setPhase('setting')
    }
  }, [template])

  useEffect(() => {
    try {
      localStorage.setItem('mathclub_progress', JSON.stringify({ level, correctCount, streak, started: screen === 'game' }))
    } catch { /* ignore */ }
  }, [level, correctCount, streak])

  function loadNewPuzzle(lvl) {
    setTemplate(generateTemplate(lvl))
  }

  // ── PHASE TRANSITIONS ────────────────────────────────────────────────────

  function handleLockIn() {
    if (template.type === 'evaluate') {
      const result = evaluateExpression(template.terms, userValues)
      if (result < 0) {
        setNegativeWarning(true)
        playWrong()
        return
      }
    }
    playClick()
    setUserAnswer(0)
    setPhase('guessing')
  }

  function handleCheck() {
    let got, expected

    if (template.type === 'target') {
      got      = evaluateExpression(template.terms, userValues)
      expected = template.target
    } else {
      got      = userAnswer
      expected = evaluateExpression(template.terms, userValues)
    }

    setGotResult(got)
    setExpected(expected)

    if (got === expected) {
      setPhase('correct')
      setStreak(s => s + 1)
      setConfetti(true)
      playCorrect()

      const newCount = correctCount + 1
      if (newCount >= CORRECT_TO_ADVANCE) {
        setCorrectCount(0)
        if (level >= MAX_LEVEL) {
          // Win!
          setTimeout(() => setScreen('win'), 1200)
        } else {
          setTimeout(() => {
            const nextLevel = level + 1
            setLevel(nextLevel)
            loadNewPuzzle(nextLevel)
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
      setShakeBtn(true)
      playWrong()
      setTimeout(() => setShakeBtn(false), 500)
    }
  }

  function handleNext() {
    playClick()
    loadNewPuzzle(level)
  }

  function handleTryAgain() {
    playClick()
    // For target mode: keep locked symbol values, just re-enter guessing
    if (template.type === 'target') {
      setUserValues(v => {
        const fresh = { ...v }
        fresh[template.mysteryId] = 1
        return fresh
      })
    }
    setPhase('guessing')
    setGotResult(null)
    setExpected(null)
  }

  function handleSymbolChange(sym, val) {
    setUserValues(v => ({ ...v, [sym]: val }))
    setNegativeWarning(false)
  }

  function handleReset() {
    playClick()
    try { localStorage.setItem('mathclub_progress', '{}') } catch { /* ignore */ }
    setShowResetConfirm(false)
    setLevel(1)
    setCorrectCount(0)
    setStreak(0)
    setTemplate(generateTemplate(1))
    setScreen('title')
  }

  // ── SCREENS ───────────────────────────────────────────────────────────────

  if (screen === 'title') return (
    <TitleScreen onPlay={() => {
      try { localStorage.setItem('mathclub_progress', JSON.stringify({ level, correctCount, streak, started: true })) } catch { /* ignore */ }
      setScreen('game')
    }} />
  )
  if (screen === 'win')   return <WinScreen   onPlayAgain={handleReset} />

  // ── GAME ──────────────────────────────────────────────────────────────────

  const { symbols, terms } = template
  const isTargetMode = template.type === 'target'
  const mysteryId    = isTargetMode ? template.mysteryId : null
  const knownSymbols = isTargetMode ? symbols.filter(id => id !== mysteryId) : symbols
  const progressDots = Array.from({ length: CORRECT_TO_ADVANCE }, (_, i) => i < correctCount)

  const phaseConfig = {
    setting:  { label: 'Lock In!  →', action: handleLockIn,   color: '#FF8C42', shadow: '#C05000' },
    guessing: { label: 'Check!',      action: handleCheck,    color: '#4B9FFF', shadow: '#1A6FAF' },
    correct:  { label: 'Next  →',    action: handleNext,     color: '#56C596', shadow: '#268C56' },
    wrong:    { label: 'Try Again',   action: handleTryAgain, color: '#FF8C42', shadow: '#C05000' },
  }
  const cta = phaseConfig[phase]

  const phaseLabel = {
    setting:  isTargetMode ? 'Lock in the other symbols' : 'Pick your numbers',
    guessing: isTargetMode ? 'Find the missing symbol!'  : 'What is the answer?',
    correct:  'Correct!',
    wrong:    'Almost!',
  }[phase]

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
            <p className="text-lg text-stone-400 text-center" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Your progress will be reset.
            </p>
            <div className="flex gap-4 w-full">
              <button
                onPointerDown={() => { playClick(); setShowResetConfirm(false) }}
                className="btn-crayon flex-1 py-4 rounded-2xl text-2xl font-bold text-stone-600 active:scale-95"
                style={{ fontFamily: 'Fredoka, sans-serif', background: '#F0EDE8', boxShadow: '0 4px 0 #C0BCB8' }}>
                No
              </button>
              <button
                onPointerDown={handleReset}
                className="btn-crayon flex-1 py-4 rounded-2xl text-2xl font-bold text-white active:scale-95"
                style={{ fontFamily: 'Fredoka, sans-serif', background: 'linear-gradient(135deg, #FF8C42, #C05000)', boxShadow: '0 4px 0 #903000' }}>
                Yes!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

        {/* LEFT / TOP: expression + legend */}
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-5
                        md:flex-1 md:border-r md:border-stone-200 md:py-8">
          <p className="text-base uppercase tracking-widest text-stone-400"
            style={{ fontFamily: 'Fredoka, sans-serif', letterSpacing: '0.15em' }}>
            {phaseLabel}
          </p>

          <ExpressionDisplay
            terms={terms}
            symbols={symbols}
            target={isTargetMode ? template.target : undefined}
          />

          {/* Legend after lock-in */}
          {phase !== 'setting' && (
            <SymbolLegend
              symbols={knownSymbols}
              userValues={userValues}
            />
          )}

          {/* In setting phase for target mode: show which symbol is the mystery */}
          {phase === 'setting' && isTargetMode && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl"
              style={{ background: '#F0DCFF', border: '2px dashed #B27BFF' }}>
              <span className="text-base text-purple-400" style={{ fontFamily: 'Nunito, sans-serif' }}>Find the value of</span>
              <SymbolIcon id={mysteryId} size={28} />
            </div>
          )}
        </div>

        {/* RIGHT / BOTTOM: controls + CTA */}
        <div className="flex flex-col items-center justify-center gap-6 px-6 pb-10 pt-4
                        md:flex-1 md:py-8">

          {/* SETTING phase */}
          {phase === 'setting' && (
            <div className="flex flex-row items-end justify-center gap-6 flex-wrap">
              {(isTargetMode ? knownSymbols : symbols).map(id => (
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

          {/* GUESSING phase */}
          {phase === 'guessing' && (
            isTargetMode ? (
              // Target mode: adjust mystery symbol value
              <SymbolCard
                id={mysteryId}
                value={userValues[mysteryId] ?? 1}
                onChange={val => handleSymbolChange(mysteryId, val)}
                disabled={false}
              />
            ) : (
              // Evaluate mode: guess the computed result
              <AnswerInput value={userAnswer} onChange={setUserAnswer} disabled={false} />
            )
          )}

          {/* RESULT feedback */}
          {(phase === 'correct' || phase === 'wrong') && (
            <Feedback phase={phase} got={gotResult} expected={expectedResult} wrongCount={wrongCount} />
          )}

          {/* Negative warning */}
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

          {/* CTA Button */}
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
