// total = string length, knownIndices = which indices are shown (rest are blanked)
const LEVEL_CONFIG = [
  // ── Forward only (levels 1–6): first two shown, fill the rest ──────────────
  { total: 3,  seedRange: [1, 6], knownIndices: [0, 1]          },  // L1:  1 blank
  { total: 4,  seedRange: [1, 6], knownIndices: [0, 1]          },  // L2:  2 blanks
  { total: 5,  seedRange: [1, 6], knownIndices: [0, 1]          },  // L3:  3 blanks
  { total: 5,  seedRange: [2, 7], knownIndices: [0, 1]          },  // L4:  bigger seeds
  { total: 6,  seedRange: [1, 7], knownIndices: [0, 1]          },  // L5:  4 blanks
  { total: 7,  seedRange: [1, 7], knownIndices: [0, 1]          },  // L6:  5 blanks
  // ── Middle gaps (levels 7–10): some middle numbers hidden too ──────────────
  { total: 7,  seedRange: [1, 7], knownIndices: [0, 1, 3]       },  // L7:  middle hidden
  { total: 8,  seedRange: [1, 6], knownIndices: [0, 1, 4]       },  // L8:  middle hidden
  { total: 9,  seedRange: [1, 6], knownIndices: [0, 1, 5]       },  // L9:  middle hidden
  { total: 10, seedRange: [1, 6], knownIndices: [0, 1, 3, 7]    },  // L10: two middles
  // ── Backward reasoning (levels 11–20): index 0 hidden, must subtract ───────
  // Index 1 (b) is always shown → a = seq[2] − seq[1] once kid fills seq[2].
  { total: 8,  seedRange: [2, 6], knownIndices: [1, 3, 5]       },  // L11: first hidden
  { total: 9,  seedRange: [2, 6], knownIndices: [1, 3, 6]       },  // L12: first hidden
  { total: 9,  seedRange: [3, 8], knownIndices: [1, 4, 7]       },  // L13: bigger seeds
  { total: 10, seedRange: [2, 7], knownIndices: [1, 3, 6, 8]    },  // L14: more gaps
  { total: 10, seedRange: [3, 8], knownIndices: [1, 4, 7]       },  // L15: sparser
  { total: 10, seedRange: [3, 9], knownIndices: [1, 3, 7]       },  // L16: bigger seeds
  { total: 11, seedRange: [2, 7], knownIndices: [1, 4, 7, 9]    },  // L17: longer string
  { total: 11, seedRange: [3, 8], knownIndices: [1, 4, 8]       },  // L18: sparser
  { total: 12, seedRange: [3, 8], knownIndices: [1, 5, 9]       },  // L19: long + sparse
  { total: 12, seedRange: [4, 9], knownIndices: [1, 5, 9]       },  // L20: big seeds, sparse
]

export const SS_MAX_LEVEL = 20
export const SS_CORRECT_TO_ADVANCE = 3

/**
 * Build all valid (a, b) pairs where a < b within seedRange.
 * Sampling uniformly from this list avoids the bias of the two-step
 * randInt approach (which over-represents pairs where a = max-1).
 */
function validPairs(seedRange) {
  const [min, max] = seedRange
  const pairs = []
  for (let a = min; a < max; a++) {
    for (let b = a + 1; b <= max; b++) {
      pairs.push([a, b])
    }
  }
  return pairs
}

/**
 * Generate a sum-string puzzle for the given level.
 * Returns { seq, knownIndices }
 */
export function generatePuzzle(level = 1, excludeSeq = null) {
  const config = LEVEL_CONFIG[Math.min(level, SS_MAX_LEVEL) - 1]
  const { total, seedRange, knownIndices } = config

  // All valid pairs, excluding the previous one if provided
  let pairs = validPairs(seedRange)
  if (excludeSeq) {
    const filtered = pairs.filter(([a, b]) => a !== excludeSeq[0] || b !== excludeSeq[1])
    if (filtered.length > 0) pairs = filtered
  }

  const [a, b] = pairs[Math.floor(Math.random() * pairs.length)]

  const seq = [a, b]
  while (seq.length < total) {
    seq.push(seq[seq.length - 1] + seq[seq.length - 2])
  }

  return { seq, knownIndices }
}
