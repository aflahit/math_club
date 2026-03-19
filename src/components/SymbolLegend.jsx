import { getSymbol, SymbolIcon } from '../symbols'

export default function SymbolLegend({ symbols, userValues }) {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-3 animate-pop-up">
      {symbols.map(id => {
        const { bg, border, stroke } = getSymbol(id)
        return (
          <div
            key={id}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl"
            style={{
              backgroundColor: bg,
              border: `2.5px solid ${border}`,
              boxShadow: `0 3px 0 ${stroke}`,
              filter: 'url(#crayon)',
            }}
          >
            <SymbolIcon id={id} size={28} />
            <span className="text-2xl font-bold text-stone-400 leading-none" style={{ fontFamily: 'Fredoka, sans-serif' }}>=</span>
            <span className="text-3xl font-bold leading-none" style={{ fontFamily: 'Fredoka, sans-serif', color: stroke }}>
              {userValues[id] ?? 1}
            </span>
          </div>
        )
      })}
    </div>
  )
}
