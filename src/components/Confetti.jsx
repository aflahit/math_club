import { useEffect, useState } from 'react'

const COLORS = ['#FF4B4B', '#FF8C42', '#FFD166', '#56C596', '#4B9FFF', '#B27BFF', '#FF6EB4']
const PIECES = 18

export default function Confetti({ active }) {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    if (!active) { setPieces([]); return }

    setPieces(
      Array.from({ length: PIECES }, (_, i) => ({
        id: i,
        x: 20 + Math.random() * 60,  // % from left
        delay: Math.random() * 0.3,
        duration: 0.8 + Math.random() * 0.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 8 + Math.random() * 10,
        rotate: Math.random() * 360,
        shape: Math.random() > 0.5 ? 'circle' : 'rect',
      }))
    )

    const t = setTimeout(() => setPieces([]), 1500)
    return () => clearTimeout(t)
  }, [active])

  if (pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 50 }}>
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: '-20px',
            width: p.size,
            height: p.shape === 'circle' ? p.size : p.size * 0.6,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            transform: `rotate(${p.rotate}deg)`,
            animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  )
}
