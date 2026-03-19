// Simple Web Audio API sound effects — no audio files needed

let ctx = null

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  return ctx
}

function playTone({ frequency, type = 'sine', duration = 0.15, gain = 0.3, delay = 0 }) {
  try {
    const ac = getCtx()
    const osc = ac.createOscillator()
    const gainNode = ac.createGain()

    osc.connect(gainNode)
    gainNode.connect(ac.destination)

    osc.type = type
    osc.frequency.setValueAtTime(frequency, ac.currentTime + delay)

    gainNode.gain.setValueAtTime(0, ac.currentTime + delay)
    gainNode.gain.linearRampToValueAtTime(gain, ac.currentTime + delay + 0.02)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + duration)

    osc.start(ac.currentTime + delay)
    osc.stop(ac.currentTime + delay + duration)
  } catch (_) {
    // Audio not supported — ignore
  }
}

export function playCorrect() {
  // Cheerful ascending arpeggio
  const notes = [523, 659, 784, 1047] // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    playTone({ frequency: freq, type: 'triangle', duration: 0.2, gain: 0.25, delay: i * 0.1 })
  })
}

export function playWrong() {
  // Low dull thud
  playTone({ frequency: 220, type: 'sine', duration: 0.25, gain: 0.2 })
  playTone({ frequency: 180, type: 'sine', duration: 0.25, gain: 0.15, delay: 0.1 })
}

export function playClick() {
  playTone({ frequency: 600, type: 'sine', duration: 0.08, gain: 0.12 })
}

export function playLevelUp() {
  // Fanfare
  const notes = [523, 659, 784, 659, 1047]
  notes.forEach((freq, i) => {
    playTone({ frequency: freq, type: 'triangle', duration: 0.25, gain: 0.28, delay: i * 0.12 })
  })
}
