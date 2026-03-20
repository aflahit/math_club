import { useRef, useCallback } from 'react'

/**
 * Returns pointer event handlers that trigger `callback` immediately on press,
 * then continuously after `delay` ms at `interval` ms intervals.
 * `onStart` fires once on the initial press (useful for playing a sound once).
 */
export function useLongPress(callback, { delay = 380, interval = 80, onStart } = {}) {
  const timeoutRef = useRef(null)
  const intervalRef = useRef(null)

  const start = useCallback(() => {
    if (onStart) onStart()
    callback()
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(callback, interval)
    }, delay)
  }, [callback, delay, interval, onStart])

  const stop = useCallback(() => {
    clearTimeout(timeoutRef.current)
    clearInterval(intervalRef.current)
  }, [])

  return {
    onPointerDown: start,
    onPointerUp:     stop,
    onPointerLeave:  stop,
    onPointerCancel: stop,
  }
}
