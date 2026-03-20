import Drone from './Drone'

const CELL_SIZE = 64

function posEq(a, b) {
  if (!a || !b) return false
  return a[0] === b[0] && a[1] === b[1]
}

function inTrail(trail, col, row) {
  return trail.some(p => p[0] === col && p[1] === row)
}

export default function Grid({
  dronePos,
  trail,
  startCell,
  endCell,
  selectedCell,
  onCellTap,
  phase,
  mode,
  revealAnswer,
  correctCell,
}) {
  const gridPx = CELL_SIZE * 5  // 320

  const hideDrone = mode === 'backward' && phase === 'predict' && selectedCell === null

  return (
    <div style={{ position: 'relative', width: gridPx, height: gridPx, flexShrink: 0 }}>
      {/* Background grid border */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 16,
        backgroundColor: '#EDE8DF',
        border: '2px solid #C8C0B0',
      }} />

      {/* Cells */}
      {Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 5 }, (_, col) => {
          const isTrailCell  = inTrail(trail, col, row)
          const isStart      = mode === 'forward' && posEq(startCell, [col, row])
          const isEnd        = mode === 'backward' && posEq(endCell, [col, row])
          const isSelected   = phase === 'predict' && posEq(selectedCell, [col, row])
          const isCorrect    = revealAnswer && posEq(correctCell, [col, row])

          let bg     = '#F5F0E8'
          let border = '#DDD5C5'
          let extra  = {}

          if (isTrailCell) {
            bg     = '#E8F5E9'
            border = '#56C596'
          } else if (isStart) {
            bg     = '#FFF0DC'
            border = '#FF8C42'
            extra  = { animation: 'cell-pulse 1.4s ease-in-out infinite' }
          } else if (isEnd) {
            bg     = '#DCF0FF'
            border = '#4B9FFF'
            extra  = { animation: 'cell-pulse 1.4s ease-in-out infinite' }
          } else if (isSelected) {
            bg     = '#F0DCFF'
            border = '#B27BFF'
          }

          if (isCorrect) {
            bg     = '#DCFFF0'
            border = '#22C55E'
            extra  = { boxShadow: '0 0 0 3px #22C55E55, 0 0 12px #22C55E44' }
          }

          const tappable = phase === 'predict'

          return (
            <div
              key={`${col}-${row}`}
              onClick={tappable ? () => onCellTap([col, row]) : undefined}
              style={{
                position: 'absolute',
                left: col * CELL_SIZE + 4,
                top:  row * CELL_SIZE + 4,
                width: 56,
                height: 56,
                borderRadius: 12,
                backgroundColor: bg,
                border: `2px solid ${border}`,
                cursor: tappable ? 'pointer' : 'default',
                transition: 'background-color 0.2s, border-color 0.2s',
                ...extra,
              }}
            />
          )
        })
      )}

      {/* Drone overlay */}
      <div style={{
        position: 'absolute',
        left: dronePos[0] * CELL_SIZE + CELL_SIZE / 2,
        top:  dronePos[1] * CELL_SIZE + CELL_SIZE / 2 + 6,
        transform: 'translate(-50%, -50%)',
        transition: 'left 0.4s ease-in-out, top 0.4s ease-in-out',
        zIndex: 10,
        pointerEvents: 'none',
        opacity: hideDrone ? 0 : 1,
      }}>
        <Drone size={40} />
      </div>
    </div>
  )
}
