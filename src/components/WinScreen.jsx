import { Star, Triangle, Gem, Moon, Heart, Sun, Trophy } from 'lucide-react'
import { playLevelUp } from '../logic/sound'
import { useEffect } from 'react'

const DECO = [
  { Icon: Star,     fill: '#FFBD59', stroke: '#E08800', size: 56, top: '5%',    left: '5%',   rotate: -15, duration: 2.8, delay: 0    },
  { Icon: Heart,    fill: '#FF7B7B', stroke: '#CF2B2B', size: 44, top: '8%',    right: '6%',  rotate:  12, duration: 2.4, delay: 0.3  },
  { Icon: Moon,     fill: '#C49BFF', stroke: '#7A4BCF', size: 50, top: '28%',   left: '3%',   rotate:  20, duration: 3.2, delay: 0.7  },
  { Icon: Triangle, fill: '#6DB8FF', stroke: '#2A7FDF', size: 46, top: '20%',   right: '4%',  rotate:  -8, duration: 2.2, delay: 0.1  },
  { Icon: Gem,      fill: '#5FD4A8', stroke: '#2A9A74', size: 52, bottom: '20%',left: '5%',   rotate:  10, duration: 3.5, delay: 1.0  },
  { Icon: Sun,      fill: '#FF9FD0', stroke: '#CF3E84', size: 48, bottom: '15%',right: '5%',  rotate: -20, duration: 2.9, delay: 0.5  },
  { Icon: Star,     fill: '#FFBD59', stroke: '#E08800', size: 32, bottom: '6%', left: '18%',  rotate:  25, duration: 2.6, delay: 1.4  },
  { Icon: Heart,    fill: '#FF7B7B', stroke: '#CF2B2B', size: 36, top: '4%',    left: '30%',  rotate: -10, duration: 3.8, delay: 0.2  },
  { Icon: Gem,      fill: '#5FD4A8', stroke: '#2A9A74', size: 30, bottom: '7%', right: '20%', rotate:  15, duration: 3.1, delay: 0.6  },
  { Icon: Triangle, fill: '#6DB8FF', stroke: '#2A7FDF', size: 38, top: '42%',   right: '3%',  rotate: -25, duration: 2.7, delay: 1.2  },
  { Icon: Moon,     fill: '#C49BFF', stroke: '#7A4BCF', size: 34, bottom: '28%',right: '14%', rotate:   5, duration: 3.4, delay: 0.8  },
  { Icon: Sun,      fill: '#FF9FD0', stroke: '#CF3E84', size: 28, top: '52%',   left: '2%',   rotate: -18, duration: 3.0, delay: 1.7  },
  { Icon: Star,     fill: '#FFBD59', stroke: '#E08800', size: 42, top: '60%',   right: '7%',  rotate:  30, duration: 2.5, delay: 0.9  },
  { Icon: Heart,    fill: '#FF7B7B', stroke: '#CF2B2B', size: 26, bottom: '35%',left: '15%',  rotate: -22, duration: 3.6, delay: 1.5  },
]

export default function WinScreen({ onPlayAgain }) {
  useEffect(() => {
    // Play a big celebratory sound on mount
    playLevelUp()
    const t1 = setTimeout(playLevelUp, 700)
    const t2 = setTimeout(playLevelUp, 1400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#FFFBF0', fontFamily: 'Nunito, sans-serif' }}
    >
      {/* Animated floating symbols */}
      {DECO.map(({ Icon, fill, stroke, size, duration, delay, rotate, ...pos }, i) => (
        <div
          key={i}
          className="absolute deco-symbol"
          style={{
            ...pos,
            '--base-rotate': `${rotate}deg`,
            '--duration': `${duration}s`,
            '--delay': `${delay}s`,
            opacity: 0.8,
          }}
        >
          <Icon size={size} fill={fill} color={stroke} strokeWidth={1.8} />
        </div>
      ))}

      {/* Center card */}
      <div
        className="flex flex-col items-center gap-6 px-12 py-12 rounded-3xl mx-6 animate-bounce-in"
        style={{
          background: 'rgba(255,251,240,0.93)',
          border: '3px solid #FFD166',
          boxShadow: '0 8px 0 #E08800, 0 12px 48px rgba(200,160,0,0.2)',
          filter: 'url(#crayon)',
          maxWidth: 480,
          width: '100%',
        }}
      >
        <Trophy size={72} fill="#FFD166" color="#E08800" strokeWidth={1.5} className="animate-star-burst" />

        <div className="flex flex-col items-center gap-2">
          <h1
            className="text-7xl font-bold text-center leading-none"
            style={{ fontFamily: 'Fredoka, sans-serif', color: '#E08800' }}
          >
            You Win!
          </h1>
          <p className="text-2xl text-stone-500 text-center" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            All 15 levels completed!
          </p>
          <p className="text-lg text-stone-400 text-center">
            You're a Math Club champion 🏆
          </p>
        </div>

        <div className="flex gap-3">
          {[Star, Triangle, Gem, Moon, Heart, Sun].map((Icon, i) => {
            const colors = ['#FFBD59','#6DB8FF','#5FD4A8','#C49BFF','#FF7B7B','#FF9FD0']
            const strokes = ['#E08800','#2A7FDF','#2A9A74','#7A4BCF','#CF2B2B','#CF3E84']
            return <Icon key={i} size={32} fill={colors[i]} color={strokes[i]} strokeWidth={1.8} />
          })}
        </div>

        <button
          onPointerDown={() => { playLevelUp(); onPlayAgain() }}
          className="btn-crayon px-16 py-5 rounded-3xl text-4xl font-bold text-white active:scale-95"
          style={{
            fontFamily: 'Fredoka, sans-serif',
            background: 'linear-gradient(135deg, #FFD166, #E08800)',
            boxShadow: '0 6px 0 #A06000, 0 8px 32px #FFD16655',
          }}
        >
          Play Again!
        </button>
      </div>
    </div>
  )
}
