import { useRef, useCallback, useEffect } from 'react'

/**
 * Returns pointer event handlers that trigger `callback` immediately on press,
 * then continuously after `delay` ms at `interval` ms intervals.
 * Uses a ref so the interval always calls the latest callback (avoids stale closure).
 */
export function useLongPress(callback, { delay = 380, interval = 80, onStart } = {}) {
  const timeoutRef  = useRef(null)
  const intervalRef = useRef(null)

  // Keep a ref to the latest callback so the interval never goes stale
  const callbackRef = useRef(callback)
  useEffect(() => { callbackRef.current = callback })

  const start = useCallback(() => {
    if (onStart) onStart()
    callbackRef.current()
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => callbackRef.current(), interval)
    }, delay)
  }, [delay, interval, onStart])

  const stop = useCallback(() => {
    clearTimeout(timeoutRef.current)
    clearInterval(intervalRef.current)
  }, [])

  return {
    onPointerDown:  start,
    onPointerUp:    stop,
    onPointerLeave: stop,
    onPointerCancel: stop,
  }
}
