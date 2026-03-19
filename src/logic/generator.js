import { SYMBOL_IDS } from '../symbols.jsx'

const LEVEL_CONFIG = {
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

export const MAX_LEVEL = 10
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

/**
 * Generate a flat list of terms (no parentheses).
 * All terms are: { type: 'symbol'|'number', id|value, sign: 1|-1 }
 * First term is always sign +1.
 * Result is guaranteed >= 0.
 */
function buildFlatTerms(symbols, constRange, allowMinus) {
  const [cMin, cMax] = constRange
  const constValue = randInt(cMin, cMax)
  const insertPos = randInt(0, symbols.length)

  const items = [...symbols.map(id => ({ type: 'symbol', id }))]
  items.splice(insertPos, 0, { type: 'number', value: constValue })

  for (let attempt = 0; attempt < 60; attempt++) {
    const signs = items.map((_, i) => {
      if (i === 0) return 1
      return allowMinus && Math.random() > 0.5 ? -1 : 1
    })

    // Must be >= 0 at minimum symbol value (1) AND at mid-range (5)
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

  // Fallback: all positive
  return items.map((item, i) => ({ ...item, sign: 1 }))
}

/**
 * Wrap a pair of adjacent flat terms into a parenthesized group.
 * Only wraps when there's a -1 sign involved (otherwise parens are pointless).
 * { type: 'group', sign: 1|-1, terms: [...flat terms inside] }
 */
function addParentheses(terms) {
  // Find candidate positions: index >= 1, where grouping changes the math
  // (i.e., the term at startIdx has sign -1, so -(a+b) differs from -a+b)
  const candidates = []
  for (let i = 1; i < terms.length - 1; i++) {
    if (terms[i].sign === -1) candidates.push(i)
  }

  if (candidates.length === 0) return terms  // nothing to group meaningfully

  const startIdx = candidates[Math.floor(Math.random() * candidates.length)]
  const groupSign = terms[startIdx].sign

  // Inner terms: first is always +1, second keeps its own sign relative to group
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

/**
 * Generate an expression template for the given level.
 * Returns { symbols, terms }
 * terms may contain 'group' nodes for levels with parentheses.
 */
export function generateTemplate(level = 1) {
  const config = LEVEL_CONFIG[Math.min(level, MAX_LEVEL)] || LEVEL_CONFIG[1]
  const { symbolCount, constRange, allowMinus, allowParens } = config

  const symbols = shuffle(SYMBOL_IDS).slice(0, symbolCount)
  let terms = buildFlatTerms(symbols, constRange, allowMinus)

  if (allowParens && terms.length >= 4 && Math.random() > 0.4) {
    terms = addParentheses(terms)
  }

  return { symbols, terms }
}

/**
 * Evaluate an expression (supports nested groups).
 */
export function evaluateExpression(terms, userValues) {
  return terms.reduce((acc, term) => {
    if (term.type === 'group') {
      const inner = evaluateExpression(term.terms, userValues)
      return acc + term.sign * inner
    }
    const val = term.type === 'symbol' ? (userValues[term.id] ?? 1) : term.value
    return acc + term.sign * val
  }, 0)
}
