import { Star, Triangle, Gem, Moon, Heart, Sun } from 'lucide-react'

const DECO = [
  { Icon: Star,     fill: '#FFBD59', stroke: '#E08800', size: 48, style: { top: '8%',  left: '6%',  transform: 'rotate(-15deg)' } },
  { Icon: Heart,    fill: '#FF7B7B', stroke: '#CF2B2B', size: 36, style: { top: '12%', right: '8%', transform: 'rotate(12deg)'  } },
  { Icon: Moon,     fill: '#C49BFF', stroke: '#7A4BCF', size: 42, style: { top: '28%', left: '4%',  transform: 'rotate(20deg)'  } },
  { Icon: Triangle, fill: '#6DB8FF', stroke: '#2A7FDF', size: 38, style: { top: '22%', right: '5%', transform: 'rotate(-8deg)'  } },
  { Icon: Gem,      fill: '#5FD4A8', stroke: '#2A9A74', size: 44, style: { bottom: '22%', left: '7%',  transform: 'rotate(10deg)'  } },
  { Icon: Sun,      fill: '#FF9FD0', stroke: '#CF3E84', size: 40, style: { bottom: '18%', right: '6%', transform: 'rotate(-20deg)' } },
  { Icon: Star,     fill: '#FFBD59', stroke: '#E08800', size: 28, style: { bottom: '8%',  left: '18%', transform: 'rotate(25deg)'  } },
  { Icon: Heart,    fill: '#FF7B7B', stroke: '#CF2B2B', size: 30, style: { top: '6%',  left: '30%', transform: 'rotate(-10deg)' } },
  { Icon: Gem,      fill: '#5FD4A8', stroke: '#2A9A74', size: 26, style: { bottom: '10%', right: '20%', transform: 'rotate(15deg)' } },
]

export default function TitleScreen({ onPlay }) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#FFFBF0', fontFamily: 'Nunito, sans-serif' }}
    >
      {/* Decorative floating symbols */}
      {DECO.map(({ Icon, fill, stroke, size, style }, i) => (
        <div key={i} className="absolute opacity-70" style={style}>
          <Icon size={size} fill={fill} color={stroke} strokeWidth={1.8} />
        </div>
      ))}

      {/* Center card */}
      <div
        className="flex flex-col items-center gap-6 px-12 py-12 rounded-3xl mx-6"
        style={{
          background: 'rgba(255,251,240,0.85)',
          border: '3px solid #FF8C42',
          boxShadow: '0 8px 0 #C05000, 0 12px 48px rgba(200,120,0,0.15)',
          filter: 'url(#crayon)',
          maxWidth: 460,
          width: '100%',
        }}
      >
        {/* Icon row */}
        <div className="flex items-center gap-3">
          <Star   size={36} fill="#FFBD59" color="#E08800" strokeWidth={1.8} />
          <Moon   size={36} fill="#C49BFF" color="#7A4BCF" strokeWidth={1.8} />
          <Heart  size={36} fill="#FF7B7B" color="#CF2B2B" strokeWidth={1.8} />
        </div>

        {/* Title */}
        <div className="flex flex-col items-center gap-1">
          <h1
            className="text-7xl font-bold text-center leading-none"
            style={{ fontFamily: 'Fredoka, sans-serif', color: '#CC6010' }}
          >
            Math Club
          </h1>
          <p
            className="text-lg text-stone-400"
            style={{ fontFamily: 'Nunito, sans-serif', letterSpacing: '0.05em' }}
          >
            by aflahit
          </p>
        </div>

        {/* Tagline */}
        <p
          className="text-xl text-stone-500 text-center"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          Pick numbers. Solve the equation. Have fun!
        </p>

        {/* Play button */}
        <button
          onPointerDown={onPlay}
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
