import { useEffect, useRef, useState } from 'react'
import type { Place } from '../utils/places'

export function useRoller(candidates: Place[], locked: boolean) {
  const [isRunning, setIsRunning] = useState(false)
  const [current, setCurrent] = useState<Place | null>(null)
  const [winner, setWinner] = useState<Place | null>(null)
  const [elapsed, setElapsed] = useState(0)

  const intervalRef = useRef<number | null>(null)
  const timerRef = useRef<number | null>(null)
  const stopTimeoutRef = useRef<number | null>(null)

  const stop = () => {
    setIsRunning(false)
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (stopTimeoutRef.current) {
      window.clearTimeout(stopTimeoutRef.current)
      stopTimeoutRef.current = null
    }
  }

  const start = () => {
    if (candidates.length === 0) return
    if (winner || locked) return

    setIsRunning(true)
    setWinner(null)
    setElapsed(0)

    intervalRef.current = window.setInterval(() => {
      const idx = Math.floor(Math.random() * candidates.length)
      setCurrent(candidates[idx])
    }, 120)

    const startTs = Date.now()
    timerRef.current = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTs) / 1000))
    }, 250)

    stopTimeoutRef.current = window.setTimeout(() => {
      stop()
      const idx = Math.floor(Math.random() * candidates.length)
      setWinner(candidates[idx])
    }, 10_000)
  }

  // Cleanup on unmount
  useEffect(() => () => stop(), [])

  // If candidates list changes while running, reset to avoid index issues
  useEffect(() => {
    stop()
    setCurrent(null)
    // keep winner to show result unless external reset happens
  }, [candidates])

  const resetWinner = () => setWinner(null)

  return { isRunning, current, winner, elapsed, start, stop, resetWinner }
}
