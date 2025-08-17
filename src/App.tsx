import { useEffect, useMemo, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import data from './data/random.json'

type Place = {
  id: string
  name: string
  category: string
  city?: string
  description?: string
  address?: string
  priceRange?: string
  difficulty?: string
}

const CATEGORIES: { key: string; label: string }[] = [
  { key: 'cena', label: 'Cena' },
  { key: 'aventura', label: 'Aventura' },
  { key: 'recreacion', label: 'Recreación' },
  { key: 'turismo', label: 'Turismo' },
  { key: 'esparcimiento', label: 'Esparcimiento' },
  { key: 'cultura', label: 'Cultura' },
]

function App() {
  const [category, setCategory] = useState<string>('cena')
  const [isRunning, setIsRunning] = useState(false)
  const [current, setCurrent] = useState<Place | null>(null)
  const [winner, setWinner] = useState<Place | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<number | null>(null)
  const timerRef = useRef<number | null>(null)
  const stopTimeoutRef = useRef<number | null>(null)

  const places = data as Place[]

  const filtered = useMemo(
    () => places.filter((p) => p.category === category),
    [places, category]
  )

  const bgByCategory: Record<string, string> = {
    cena: 'from-rose-950 via-rose-900 to-rose-950',
    aventura: 'from-emerald-950 via-emerald-900 to-emerald-950',
    recreacion: 'from-sky-950 via-sky-900 to-sky-950',
    turismo: 'from-indigo-950 via-indigo-900 to-indigo-950',
    esparcimiento: 'from-amber-950 via-amber-900 to-amber-950',
    cultura: 'from-purple-950 via-purple-900 to-purple-950',
  }

  useEffect(() => {
    // reset state when category changes
    stop()
    setWinner(null)
    setCurrent(null)
  }, [category])

  // Fire confetti when we have a winner
  useEffect(() => {
    if (!winner) return

    const duration = 2000
    const end = Date.now() + duration
    const defaults = { startVelocity: 35, spread: 360, ticks: 70, zIndex: 60 }

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const confettiInterval = window.setInterval(() => {
      if (Date.now() > end) {
        window.clearInterval(confettiInterval)
        return
      }
      confetti({
        ...defaults,
        particleCount: 70,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() * 0.2 + 0.1 },
      })
      confetti({
        ...defaults,
        particleCount: 70,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() * 0.2 + 0.1 },
      })
    }, 250)

    return () => window.clearInterval(confettiInterval)
  }, [winner])

  const start = () => {
    if (filtered.length === 0) return
  if (winner) return // locked after winner
    setIsRunning(true)
    setWinner(null)
    setElapsed(0)

    intervalRef.current = window.setInterval(() => {
      const idx = Math.floor(Math.random() * filtered.length)
      setCurrent(filtered[idx])
    }, 120)

    const startTs = Date.now()
    timerRef.current = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTs) / 1000))
    }, 250)

    // stop after 10 seconds and pick a final winner
    const timeoutId = window.setTimeout(() => {
      stop()
      const idx = Math.floor(Math.random() * filtered.length)
      setWinner(filtered[idx])
    }, 10_000)
    stopTimeoutRef.current = timeoutId
  }

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

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${bgByCategory[category] ?? 'from-slate-950 via-slate-900 to-slate-950'} text-slate-100 flex flex-col items-center justify-center`}>
      <header className="w-full max-w-4xl px-6 sm:px-8 py-8 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Random Places • Carabobo
        </h1>
        <p className="text-slate-300 mt-2">Elige una categoría y deja que la suerte decida.</p>
      </header>

      <main className="w-full max-w-4xl px-6 sm:px-8 pb-14 flex flex-col items-center">
        {/* Category menu */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              disabled={isRunning || !!winner}
              className={
                'px-4 py-2 rounded-full border transition focus:outline-none focus:ring-2 focus:ring-emerald-400 ' +
                (category === c.key
                  ? 'bg-emerald-500 border-emerald-400 text-white shadow'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-600 disabled:opacity-40')
              }
            >
              {c.label}
            </button>
          ))}
        </div>

        <section className="grid w-full gap-6 md:grid-cols-2 items-stretch">
          {/* Roller */}
          <div className="bg-black/30 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Sorteo</h2>
              <div className="text-sm text-slate-300">
                {isRunning ? `Tiempo: ${Math.min(10, elapsed)}s` : winner ? '¡Resultado!' : 'Listo'}
              </div>
            </div>

            <div className="relative h-52 overflow-hidden rounded-xl border border-white/10 bg-black/30 flex items-center justify-center">
              <div
                className={
                  'text-center px-6 transition-transform duration-150 ' +
                  (isRunning ? 'animate-pulse' : '')
                }
              >
                <div className="text-2xl sm:text-3xl font-semibold">
                  {winner?.name || current?.name || '—'}
                </div>
                <div className="text-sm text-slate-300">
                  {winner?.city || current?.city || ''}
                </div>
                {(winner || current)?.description && (
                  <div className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {(winner || current)!.description}
                  </div>
                )}
              </div>

              {/* glow ring when winner */}
              {winner && (
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-4 ring-emerald-400/60 animate-[ping_1s_ease-in-out_3]"></div>
              )}
            </div>

            <div className="mt-6 flex gap-3 justify-center">
              <button
                onClick={start}
                disabled={isRunning || filtered.length === 0 || !!winner}
                className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow"
              >
                {isRunning ? 'Sorteando…' : 'Iniciar (10s)'}
              </button>
              <button
                onClick={stop}
                disabled={!isRunning || !!winner}
                className="px-5 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 font-medium"
              >
                Detener
              </button>
            </div>
          </div>

          {/* List of candidates */}
          <div className="bg-black/30 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Lugares en {CATEGORIES.find((c) => c.key === category)?.label}
            </h3>
            {filtered.length === 0 ? (
              <p className="text-slate-300 text-center">No hay lugares para esta categoría.</p>
            ) : (
              <ul className="grid sm:grid-cols-2 gap-3">
                {filtered.map((p) => (
                  <li
                    key={p.id}
                    className={
                      'p-3 rounded-lg border transition text-center ' +
                      (winner?.id === p.id
                        ? 'border-emerald-400 bg-emerald-500/10'
                        : 'border-white/10 bg-black/30 hover:bg-black/40')
                    }
                  >
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-slate-400">{p.city}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
