import { SymbolIcon } from '../symbols.jsx'

function Op({ sign, isFirst }) {
  if (isFirst && sign === 1) return null
  return (
    <span className="text-4xl font-bold text-stone-400 leading-none" style={{ fontFamily: 'Fredoka, sans-serif' }}>
      {sign === 1 ? '+' : '−'}
    </span>
  )
}

function NumberChip({ value }) {
  return (
    <span className="text-5xl font-bold text-stone-600 leading-none" style={{ fontFamily: 'Fredoka, sans-serif' }}>
      {value}
    </span>
  )
}

function Paren({ children }) {
  return (
    <span className="text-5xl font-bold leading-none" style={{ fontFamily: 'Fredoka, sans-serif', color: '#A09088' }}>
      {children}
    </span>
  )
}

/** Render a flat list of terms (no groups inside) */
function FlatTerms({ terms, symbols }) {
  return terms.map((term, i) => (
    <div key={i} className="flex items-center gap-x-2">
      <Op sign={term.sign} isFirst={i === 0} />
      {term.type === 'symbol'
        ? <SymbolIcon id={term.id} size={48} />
        : <NumberChip value={term.value} />
      }
    </div>
  ))
}

/** Render any term — handles flat terms and group nodes */
function Term({ term, isFirst, symbols }) {
  if (term.type === 'group') {
    return (
      <div className="flex items-center gap-x-2">
        <Op sign={term.sign} isFirst={isFirst} />
        <Paren>(</Paren>
        <div className="flex items-center gap-x-2">
          <FlatTerms terms={term.terms} symbols={symbols} />
        </div>
        <Paren>)</Paren>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-x-2">
      <Op sign={term.sign} isFirst={isFirst} />
      {term.type === 'symbol'
        ? <SymbolIcon id={term.id} size={48} />
        : <NumberChip value={term.value} />
      }
    </div>
  )
}

export default function ExpressionDisplay({ terms, symbols }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 px-4">
      {terms.map((term, i) => (
        <Term key={i} term={term} isFirst={i === 0} symbols={symbols} />
      ))}

      {/* = ? */}
      <div className="flex items-center gap-x-2">
        <span className="text-4xl font-bold text-stone-400 leading-none" style={{ fontFamily: 'Fredoka, sans-serif' }}>=</span>
        <span className="text-5xl font-bold leading-none" style={{ fontFamily: 'Fredoka, sans-serif', color: '#C8C0B8' }}>?</span>
      </div>
    </div>
  )
}
