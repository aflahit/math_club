import { Star, Triangle, Gem, Moon, Heart, Sun } from 'lucide-react'
import { playLevelUp } from '../logic/sound'

const DECO = [
  { Icon: Star,     fill: '#FFBD59', stroke: '#E08800', size: 52, top: '7%',    left: '6%',   rotate: -15, duration: 3.2, delay: 0    },
  { Icon: Heart,    fill: '#FF7B7B', stroke: '#CF2B2B', size: 40, top: '11%',   right: '8%',  rotate:  12, duration: 2.8, delay: 0.4  },
  { Icon: Moon,     fill: '#C49BFF', stroke: '#7A4BCF', size: 46, top: '30%',   left: '4%',   rotate:  20, duration: 3.6, delay: 0.9  },
  { Icon: Triangle, fill: '#6DB8FF', stroke: '#2A7FDF', size: 42, top: '22%',   right: '5%',  rotate:  -8, duration: 2.5, delay: 0.2  },
  { Icon: Gem,      fill: '#5FD4A8', stroke: '#2A9A74', size: 48, bottom: '22%',left: '7%',   rotate:  10, duration: 3.9, delay: 1.1  },
  { Icon: Sun,      fill: '#FF9FD0', stroke: '#CF3E84', size: 44, bottom: '18%',right: '6%',  rotate: -20, duration: 3.1, delay: 0.6  },
  { Icon: Star,     fill: '#FFBD59', stroke: '#E08800', size: 30, bottom: '8%', left: '20%',  rotate:  25, duration: 2.7, delay: 1.5  },
  { Icon: Heart,    fill: '#FF7B7B', stroke: '#CF2B2B', size: 34, top: '5%',    left: '32%',  rotate: -10, duration: 4.0, delay: 0.3  },
  { Icon: Gem,      fill: '#5FD4A8', stroke: '#2A9A74', size: 28, bottom: '9%', right: '22%', rotate:  15, duration: 3.4, delay: 0.8  },
  { Icon: Triangle, fill: '#6DB8FF', stroke: '#2A7FDF', size: 36, top: '45%',   right: '3%',  rotate: -25, duration: 2.9, delay: 1.3  },
  { Icon: Moon,     fill: '#C49BFF', stroke: '#7A4BCF', size: 32, bottom: '30%',right: '15%', rotate:   5, duration: 3.7, delay: 0.7  },
  { Icon: Sun,      fill: '#FF9FD0', stroke: '#CF3E84', size: 26, top: '55%',   left: '3%',   rotate: -18, duration: 3.3, delay: 1.8  },
]

export default function TitleScreen({ onPlay }) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#FFFBF0', fontFamily: 'Nunito, sans-serif' }}
    >
      {/* Animated decorative symbols */}
      {DECO.map(({ Icon, fill, stroke, size, duration, delay, rotate, ...pos }, i) => (
        <div
          key={i}
          className="absolute deco-symbol"
          style={{
            ...pos,
            '--base-rotate': `${rotate}deg`,
            '--duration': `${duration}s`,
            '--delay': `${delay}s`,
            opacity: 0.75,
          }}
        >
          <Icon size={size} fill={fill} color={stroke} strokeWidth={1.8} />
        </div>
      ))}

      {/* Center card */}
      <div
        className="flex flex-col items-center gap-6 px-12 py-12 rounded-3xl mx-6 animate-pop-up"
        style={{
          background: 'rgba(255,251,240,0.92)',
          border: '3px solid #FF8C42',
          boxShadow: '0 8px 0 #C05000, 0 12px 48px rgba(200,120,0,0.15)',
          filter: 'url(#crayon)',
          maxWidth: 460,
          width: '100%',
        }}
      >
        {/* Icon row */}
        <div className="flex items-center gap-3">
          <Star  size={36} fill="#FFBD59" color="#E08800" strokeWidth={1.8} />
          <Moon  size={36} fill="#C49BFF" color="#7A4BCF" strokeWidth={1.8} />
          <Heart size={36} fill="#FF7B7B" color="#CF2B2B" strokeWidth={1.8} />
        </div>

        {/* Title */}
        <div className="flex flex-col items-center gap-1">
          <h1
            className="text-7xl font-bold text-center leading-none"
            style={{ fontFamily: 'Fredoka, sans-serif', color: '#CC6010' }}
          >
            Math Club
          </h1>
          <p className="text-lg text-stone-400" style={{ letterSpacing: '0.05em' }}>
            by aflahit
          </p>
        </div>

        {/* Tagline */}
        <p className="text-xl text-stone-500 text-center">
          Pick numbers. Solve the equation. Have fun!
        </p>

        {/* Play button */}
        <button
          onPointerDown={() => { playLevelUp(); onPlay() }}
          className="btn-crayon px-20 py-5 rounded-3xl text-4xl font-bold text-white active:scale-95 transition-all"
          style={{
            fontFamily: 'Fredoka, sans-serif',
            background: 'linear-gradient(135deg, #FF8C42, #C05000)',
            boxShadow: '0 6px 0 #903000, 0 8px 32px #FF8C4255',
          }}
        >
          Play!
        </button>
      </div>
    </div>
  )
}
