export const GRID_SIZE = 5
export const DIR_MAX_LEVEL = 20
export const DIR_CORRECT_TO_ADVANCE = 3

const DIRECTIONS = [
  { direction: 'up',    delta: [0, -1], arrow: '↑', label: 'Up'    },
  { direction: 'down',  delta: [0,  1], arrow: '↓', label: 'Down'  },
  { direction: 'left',  delta: [-1, 0], arrow: '←', label: 'Left'  },
  { direction: 'right', delta: [1,  0], arrow: '→', label: 'Right' },
]

const OPPOSITES = { up: 'down', down: 'up', left: 'right', right: 'left' }

function levelConfig(level) {
  if (level <= 3)  return { stepCount: 1, mode: 'forward' }
  if (level <= 7)  return { stepCount: 2, mode: 'forward' }
  if (level <= 12) return { stepCount: 3, mode: 'forward' }
  if (level <= 14) return { stepCount: 2, mode: 'backward' }
  return                   { stepCount: 3, mode: 'backward' }
}

function clamp(v) {
  return Math.max(0, Math.min(GRID_SIZE - 1, v))
}

function posEq(a, b) {
  return a[0] === b[0] && a[1] === b[1]
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function tryGenerate(stepCount, mode) {
  const start = [randomInt(0, GRID_SIZE - 1), randomInt(0, GRID_SIZE - 1)]
  const steps = []
  let pos = [...start]
  let lastDir = null

  for (let s = 0; s < stepCount; s++) {
    // Collect valid directions
    const validDirs = DIRECTIONS.filter(d => {
      // No immediate reversal
      if (lastDir && d.direction === OPPOSITES[lastDir]) return false
      // Must be able to move at least 1 step
      const nx = pos[0] + d.delta[0]
      const ny = pos[1] + d.delta[1]
      return nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE
    })

    if (validDirs.length === 0) return null

    const dir = validDirs[Math.floor(Math.random() * validDirs.length)]

    // How many steps can we go in this direction?
    let maxCount = 0
    let np = [...pos]
    while (true) {
      const nx = np[0] + dir.delta[0]
      const ny = np[1] + dir.delta[1]
      if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) break
      maxCount++
      np = [nx, ny]
      if (maxCount >= 3) break
    }
    if (maxCount === 0) return null

    const count = randomInt(1, maxCount)
    pos = [pos[0] + dir.delta[0] * count, pos[1] + dir.delta[1] * count]

    steps.push({ direction: dir.direction, count, arrow: dir.arrow, label: dir.label })
    lastDir = dir.direction
  }

  const end = pos
  if (posEq(start, end)) return null

  return { start, steps, end, mode }
}

export function generatePuzzle(level) {
  const { stepCount, mode } = levelConfig(level)

  for (let attempt = 0; attempt < 50; attempt++) {
    const result = tryGenerate(stepCount, mode)
    if (result) return result
  }

  // Fallback: simple guaranteed puzzle
  return {
    start: [0, 0],
    steps: [{ direction: 'right', count: 1, arrow: '→', label: 'Right' }],
    end: [1, 0],
    mode,
  }
}

export function computePath(start, steps) {
  const path = [[...start]]
  let pos = [...start]

  for (const step of steps) {
    const dir = DIRECTIONS.find(d => d.direction === step.direction)
    if (!dir) continue
    for (let i = 0; i < step.count; i++) {
      pos = [clamp(pos[0] + dir.delta[0]), clamp(pos[1] + dir.delta[1])]
      path.push([...pos])
    }
  }

  return path
}
