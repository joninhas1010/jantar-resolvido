import { useState, useRef, useCallback, useEffect } from 'react'

export function useTimer(totalSeconds: number, onFinish?: () => void) {
  const [remaining, setRemaining] = useState(totalSeconds)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<number | null>(null)

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    if (remaining <= 0) return
    setRunning(true)
    clear()
    intervalRef.current = window.setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clear()
          setRunning(false)
          onFinish?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [remaining, clear, onFinish])

  const pause = useCallback(() => {
    setRunning(false)
    clear()
  }, [clear])

  const reset = useCallback(() => {
    clear()
    setRunning(false)
    setRemaining(totalSeconds)
  }, [totalSeconds, clear])

  useEffect(() => {
    return clear
  }, [clear])

  useEffect(() => {
    setRemaining(totalSeconds)
    setRunning(false)
    clear()
  }, [totalSeconds, clear])

  return { remaining, running, start, pause, reset }
}
