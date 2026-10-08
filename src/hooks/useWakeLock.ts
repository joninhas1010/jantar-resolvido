import { useEffect, useRef, useState } from 'react'

export function useWakeLock() {
  const [isActive, setIsActive] = useState(false)
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  const request = async () => {
    if (!('wakeLock' in navigator)) return
    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen')
      setIsActive(true)
      wakeLockRef.current.addEventListener('release', () => setIsActive(false))
    } catch { /* silently fail */ }
  }

  const release = async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release()
      } catch { /* silently fail */ }
      wakeLockRef.current = null
      setIsActive(false)
    }
  }

  useEffect(() => {
    return () => { release() }
  }, [])

  return { isActive, request, release }
}
