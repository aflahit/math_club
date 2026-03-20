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

function FlatTerms({ terms, mysteryId }) {
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

function Term({ term, isFirst, mysteryId }) {
  if (term.type === 'group') {
    return (
      <div className="flex items-center gap-x-2">
        <Op sign={term.sign} isFirst={isFirst} />
        <Paren>(</Paren>
        <FlatTerms terms={term.terms} mysteryId={mysteryId} />
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

export default function ExpressionDisplay({ terms, symbols, target }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 px-4">
      {terms.map((term, i) => (
        <Term key={i} term={term} isFirst={i === 0} symbols={symbols} />
      ))}

      <div className="flex items-center gap-x-2">
        <span className="text-4xl font-bold text-stone-400 leading-none" style={{ fontFamily: 'Fredoka, sans-serif' }}>=</span>
        {target !== undefined ? (
          <span
            className="text-5xl font-bold leading-none px-4 py-1 rounded-2xl"
            style={{
              fontFamily: 'Fredoka, sans-serif',
              color: '#7A3FBF',
              background: '#F0DCFF',
              border: '2.5px solid #B27BFF',
            }}
          >
            {target}
          </span>
        ) : (
          <span className="text-5xl font-bold leading-none" style={{ fontFamily: 'Fredoka, sans-serif', color: '#C8C0B8' }}>?</span>
        )}
      </div>
    </div>
  )
}
