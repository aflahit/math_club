import { useState } from 'react'
import { Star, Gem, Heart } from 'lucide-react'
import { playClick } from '../logic/sound'

function MiniRope() {
  return (
    <div className="relative flex justify-center w-full py-1">
      <div className="absolute left-4 right-4"
        style={{
          top: 8,
          height: 6,
          background: 'repeating-linear-gradient(90deg, #92400e 0px, #78350f 8px, #92400e 16px)',
          borderRadius: 3,
        }}
      />
      <div className="relative z-10 flex items-start justify-center gap-2">
        {['#FFF0DC','#DCF0FF','#DCFFF0','#F0DCFF'].map((bg, i) => (
          <div key={i} className="flex flex-col items-center">
            <div style={{ width: 2, height: 12, backgroundColor: '#92400e', margin: '0 auto' }} />
            <div className="flex items-center justify-center rounded-lg px-2 py-1 text-xs font-bold"
              style={{
                backgroundColor: bg,
                border: '2px solid #aaa',
                fontFamily: 'Fredoka, sans-serif',
                color: '#555',
                minWidth: 24,
              }}>
              {i < 2 ? [1,2][i] : '?'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function GameSelectScreen({ onSelectSymbols, onSelectSumStrings, symbolsLevel, ssLevel }) {
  const [hoveredKey, setHoveredKey] = useState(null)

  const games = [
    {
      key: 'symbols',
      title: 'Symbols!',
      desc: 'Assign values to symbols and solve expressions',
      level: symbolsLevel || 1,
      color: '#FF8C42',
      shadow: '#C05000',
      bg: '#FFF0DC',
      border: '#FF8C42',
      onPlay: onSelectSymbols,
      preview: (
        <div className="flex items-center justify-center gap-3 py-3">
          <Star  size={36} fill="#FFBD59" color="#E08800" strokeWidth={1.8} />
          <span className="text-2xl font-bold text-stone-400" style={{ fontFamily: 'Fredoka, sans-serif' }}>+</span>
          <Gem   size={36} fill="#5FD4A8" color="#2A9A74" strokeWidth={1.8} />
          <span className="text-2xl font-bold text-stone-400" style={{ fontFamily: 'Fredoka, sans-serif' }}>=</span>
          <Heart size={36} fill="#FF7B7B" color="#CF2B2B" strokeWidth={1.8} />
          <span className="text-2xl font-bold text-stone-300" style={{ fontFamily: 'Fredoka, sans-serif' }}>?</span>
        </div>
      ),
    },
    {
      key: 'sumstrings',
      title: 'Sum Strings',
      desc: 'Complete the number sequence on the clothesline',
      level: ssLevel || 1,
      color: '#4B9FFF',
      shadow: '#1A6FAF',
      bg: '#DCF0FF',
      border: '#4B9FFF',
      onPlay: onSelectSumStrings,
      preview: <MiniRope />,
    },
  ]

  return (
    <div className="fixed inset-0 overflow-y-auto"
      style={{ fontFamily: 'Nunito, sans-serif', backgroundColor: '#FFFBF0' }}>

      <div className="min-h-full flex flex-col items-center justify-center px-6 py-8">

        <div className="flex flex-col items-center gap-2 mb-8">
          <h1 className="text-5xl font-bold text-stone-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            Math Club
          </h1>
          <p className="text-lg text-stone-400" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Choose a game to play
          </p>
        </div>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
        {games.map(game => {
          const isHovered = hoveredKey === game.key
          return (
            <button
              key={game.key}
              onPointerDown={() => { playClick(); game.onPlay?.() }}
              onMouseEnter={() => setHoveredKey(game.key)}
              onMouseLeave={() => setHoveredKey(null)}
              className="flex-1 flex flex-col items-center gap-3 px-6 py-6 rounded-3xl text-left active:scale-95"
              style={{
                backgroundColor: game.bg,
                border: `3px solid ${game.border}`,
                boxShadow: isHovered
                  ? `0 10px 0 ${game.shadow}, 0 16px 40px ${game.border}55`
                  : `0 6px 0 ${game.shadow}, 0 10px 30px ${game.border}33`,
                filter: 'url(#crayon)',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              <div className="w-full">{game.preview}</div>

              <h2 className="text-3xl font-bold text-center" style={{ fontFamily: 'Fredoka, sans-serif', color: game.shadow }}>
                {game.title}
              </h2>

              <p className="text-sm text-stone-500 text-center leading-snug" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {game.desc}
              </p>

              <div className="flex items-center gap-2 mt-1 px-3 py-1 rounded-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: `1.5px solid ${game.border}` }}>
                <span className="text-sm font-bold" style={{ fontFamily: 'Fredoka, sans-serif', color: game.shadow }}>
                  Level {game.level}
                </span>
              </div>

              <div className="mt-1 px-8 py-3 rounded-2xl text-xl font-bold text-white"
                style={{
                  fontFamily: 'Fredoka, sans-serif',
                  background: `linear-gradient(135deg, ${game.color}, ${game.shadow})`,
                  boxShadow: isHovered ? `0 6px 0 ${game.shadow}` : `0 4px 0 ${game.shadow}`,
                  transition: 'box-shadow 0.15s ease',
                }}>
                Play!
              </div>
            </button>
          )
        })}
      </div>

      </div>
    </div>
  )
}
