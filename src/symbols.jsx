import { Star, Triangle, Gem, Moon, Heart, Sun } from 'lucide-react'

// One source of truth for all symbol definitions
export const SYMBOL_CONFIG = [
  { id: 'star',     Icon: Star,     fill: '#FFBD59', stroke: '#E08800', bg: '#FFF8DC', border: '#FFBD59' },
  { id: 'triangle', Icon: Triangle, fill: '#6DB8FF', stroke: '#2A7FDF', bg: '#DCF0FF', border: '#6DB8FF' },
  { id: 'gem',      Icon: Gem,      fill: '#5FD4A8', stroke: '#2A9A74', bg: '#DCFFF5', border: '#5FD4A8' },
  { id: 'moon',     Icon: Moon,     fill: '#C49BFF', stroke: '#7A4BCF', bg: '#F3EAFF', border: '#C49BFF' },
  { id: 'heart',    Icon: Heart,    fill: '#FF7B7B', stroke: '#CF2B2B', bg: '#FFDCDC', border: '#FF7B7B' },
  { id: 'sun',      Icon: Sun,      fill: '#FF9FD0', stroke: '#CF3E84', bg: '#FFE8F4', border: '#FF9FD0' },
]

export const SYMBOL_IDS = SYMBOL_CONFIG.map(s => s.id)

export function getSymbol(id) {
  return SYMBOL_CONFIG.find(s => s.id === id) || SYMBOL_CONFIG[0]
}

// Reusable icon renderer
export function SymbolIcon({ id, size = 40, className = '' }) {
  const { Icon, fill, stroke } = getSymbol(id)
  return (
    <Icon
      size={size}
      fill={fill}
      color={stroke}
      strokeWidth={1.8}
      className={className}
    />
  )
}
