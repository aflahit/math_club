import { SYMBOL_IDS } from '../symbols.jsx'

// ── EVALUATE MODE (levels 1–10) ────────────────────────────────────────────
const EVAL_LEVEL_CONFIG = {
  1:  { symbolCount: 1, constRange: [1, 4], allowMinus: false, allowParens: false },
  2:  { symbolCount: 1, constRange: [2, 7], allowMinus: false, allowParens: false },
  3:  { symbolCount: 2, constRange: [2, 5], allowMinus: false, allowParens: false },
  4:  { symbolCount: 2, constRange: [2, 6], allowMinus: true,  allowParens: false },
  5:  { symbolCount: 3, constRange: [2, 5], allowMinus: false, allowParens: false },
  6:  { symbolCount: 3, constRange: [2, 6], allowMinus: true,  allowParens: false },
  7:  { symbolCount: 4, constRange: [2, 6], allowMinus: true,  allowParens: false },
  8:  { symbolCount: 4, constRange: [2, 6], allowMinus: true,  allowParens: true  },
  9:  { symbolCount: 5, constRange: [2, 6], allowMinus: true,  allowParens: true  },
  10: { symbolCount: 6, constRange: [2, 6], allowMinus: true,  allowParens: true  },
}

// ── TARGET MODE (levels 11–20) — backward thinking ─────────────────────────
// Mystery symbol always has sign +1; kid figures out its value.
const TARGET_LEVEL_CONFIG = {
  11: { symbolCount: 1, constRange: [2, 6],  allowMinus: false, allowParens: false, solRange: [2, 7],  targetRange: [5,  12] },
  12: { symbolCount: 2, constRange: [2, 5],  allowMinus: false, allowParens: false, solRange: [2, 6],  targetRange: [8,  16] },
  13: { symbolCount: 2, constRange: [2, 6],  allowMinus: true,  allowParens: false, solRange: [2, 7],  targetRange: [6,  14] },
  14: { symbolCount: 3, constRange: [2, 5],  allowMinus: false, allowParens: false, solRange: [2, 6],  targetRange: [10, 20] },
  15: { symbolCount: 3, constRange: [2, 6],  allowMinus: true,  allowParens: false, solRange: [2, 8],  targetRange: [8,  18] },
  16: { symbolCount: 4, constRange: [3, 8],  allowMinus: true,  allowParens: false, solRange: [3, 9],  targetRange: [10, 25] },
  17: { symbolCount: 4, constRange: [3, 8],  allowMinus: true,  allowParens: false, solRange: [4, 10], targetRange: [15, 30] },
  18: { symbolCount: 5, constRange: [3, 8],  allowMinus: true,  allowParens: true,  solRange: [3, 9],  targetRange: [12, 28] },
  19: { symbolCount: 5, constRange: [3, 9],  allowMinus: true,  allowParens: true,  solRange: [4, 10], targetRange: [15, 35] },
  20: { symbolCount: 6, constRange: [2, 8],  allowMinus: true,  allowParens: true,  solRange: [3, 10], targetRange: [10, 40] },
}

export const MAX_LEVEL = 20
export const CORRECT_TO_ADVANCE = 3

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── Shared expression evaluator (used by both generator and game) ───────────

export function evaluateExpression(terms, userValues) {
  return terms.reduce((acc, term) => {
    if (term.type === 'group') {
      return acc + term.sign * evaluateExpression(term.terms, userValues)
    }
    const val = term.type === 'symbol' ? (userValues[term.id] ?? 1) : term.value
    return acc + term.sign * val
  }, 0)
}

// ── Shared flat-term builder ────────────────────────────────────────────────

function buildFlatTerms(symbols, constRange, allowMinus, pinnedPositive = []) {
  const [cMin, cMax] = constRange
  const constValue = randInt(cMin, cMax)
  const insertPos = randInt(0, symbols.length)

  const items = [...symbols.map(id => ({ type: 'symbol', id }))]
  items.splice(insertPos, 0, { type: 'number', value: constValue })

  for (let attempt = 0; attempt < 60; attempt++) {
    const signs = items.map((item, i) => {
      if (i === 0) return 1
      if (item.type === 'symbol' && pinnedPositive.includes(item.id)) return 1
      return allowMinus && Math.random() > 0.5 ? -1 : 1
    })

    // Must stay >= 0 at minimum symbol value (1) and mid-range (5)
    const atMin = items.reduce((acc, item, i) => {
      const v = item.type === 'number' ? item.value : 1
      return acc + signs[i] * v
    }, 0)
    const atMid = items.reduce((acc, item, i) => {
      const v = item.type === 'number' ? item.value : 5
      return acc + signs[i] * v
    }, 0)

    if (atMin >= 0 && atMid >= 0) {
      return items.map((item, i) => ({ ...item, sign: signs[i] }))
    }
  }

  return items.map((item, i) => ({ ...item, sign: 1 }))
}

function addParentheses(terms) {
  const candidates = []
  for (let i = 1; i < terms.length - 1; i++) {
    if (terms[i].sign === -1) candidates.push(i)
  }
  if (candidates.length === 0) return terms

  const startIdx = candidates[Math.floor(Math.random() * candidates.length)]
  const groupSign = terms[startIdx].sign
  const innerTerms = [
    { ...terms[startIdx],     sign: 1 },
    { ...terms[startIdx + 1], sign: terms[startIdx + 1].sign },
  ]
  return [
    ...terms.slice(0, startIdx),
    { type: 'group', sign: groupSign, terms: innerTerms },
    ...terms.slice(startIdx + 2),
  ]
}

// ── Evaluate mode puzzle ────────────────────────────────────────────────────

function generateEvaluatePuzzle(level) {
  const config = EVAL_LEVEL_CONFIG[level] || EVAL_LEVEL_CONFIG[1]
  const { symbolCount, constRange, allowMinus, allowParens } = config

  const symbols = shuffle(SYMBOL_IDS).slice(0, symbolCount)
  let terms = buildFlatTerms(symbols, constRange, allowMinus)

  if (allowParens && terms.length >= 4 && Math.random() > 0.4) {
    terms = addParentheses(terms)
  }

  return { type: 'evaluate', symbols, terms }
}

// ── Target mode puzzle ──────────────────────────────────────────────────────
// Generates backwards: pick solution values → build expression → result = target.
// The mystery symbol always has sign +1, so kids never have to reason about
// subtracting an unknown.

function generateTargetPuzzle(level) {
  const config = TARGET_LEVEL_CONFIG[level] || TARGET_LEVEL_CONFIG[15]
  const { symbolCount, constRange, allowMinus, allowParens, solRange, targetRange } = config

  const symbols = shuffle(SYMBOL_IDS).slice(0, symbolCount)

  // The mystery is the last symbol — kids solve for this one
  const mysteryId = symbols[symbols.length - 1]

  // Assign solution values for all symbols
  const solution = {}
  for (const id of symbols) {
    solution[id] = randInt(solRange[0], solRange[1])
  }

  // Build expression — mystery symbol is pinned to sign +1
  for (let attempt = 0; attempt < 80; attempt++) {
    let terms = buildFlatTerms(symbols, constRange, allowMinus, [mysteryId])

    if (allowParens && terms.length >= 4 && Math.random() > 0.4) {
      terms = addParentheses(terms)
    }

    const target = evaluateExpression(terms, solution)

    if (target >= targetRange[0] && target <= targetRange[1]) {
      return { type: 'target', symbols, terms, target, mysteryId, solution }
    }
  }

  // Fallback: all positive, no parens
  const [cMin, cMax] = constRange
  const constValue = randInt(cMin, cMax)
  const items = [...symbols.map(id => ({ type: 'symbol', id }))]
  items.splice(randInt(0, symbols.length), 0, { type: 'number', value: constValue })
  const terms = items.map((item, i) => ({ ...item, sign: 1 }))
  const target = evaluateExpression(terms, solution)
  return { type: 'target', symbols, terms, target, mysteryId, solution }
}

// ── Public API ──────────────────────────────────────────────────────────────

export function generateTemplate(level = 1) {
  if (level >= 11) return generateTargetPuzzle(level)
  return generateEvaluatePuzzle(level)
}
