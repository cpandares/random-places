import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import data from './data/random.json'
import { fetchPlacesByCategory, type Place } from './utils/places'
import { Dialog, Transition } from '@headlessui/react'

const CATEGORIES: { key: string; label: string }[] = [
  { key: 'cena', label: 'Cena' },
  { key: 'aventura', label: 'Aventura' },
  { key: 'recreacion', label: 'Recreación' },
  { key: 'turismo', label: 'Turismo' },
  { key: 'esparcimiento', label: 'Esparcimiento' },
  { key: 'cultura', label: 'Cultura' },
  { key: 'compras', label: 'Compras' },
  { key: 'vida_nocturna', label: 'Vida nocturna' },
  { key: 'playas', label: 'Playas' },
  { key: 'naturaleza', label: 'Naturaleza' },
  { key: 'deportes', label: 'Deportes' },
]

type RegionKey = 'carabobo' | 'cojedes' | 'aragua' | 'miranda' | 'lara' | 'falcon' | 'distrito_capital'
const REGIONS: { key: RegionKey; label: string; center: { lon: number; lat: number }; radius: number }[] = [
  { key: 'carabobo', label: 'Carabobo', center: { lon: -68.0, lat: 10.166 }, radius: 60000 },
  { key: 'cojedes', label: 'Cojedes', center: { lon: -68.33, lat: 9.38 }, radius: 50000 },
  { key: 'aragua', label: 'Aragua', center: { lon: -67.59, lat: 10.24 }, radius: 60000 },
  { key: 'miranda', label: 'Miranda', center: { lon: -66.89, lat: 10.34 }, radius: 60000 },
  { key: 'lara', label: 'Lara', center: { lon: -69.35, lat: 10.07 }, radius: 60000 },
  { key: 'falcon', label: 'Falcón', center: { lon: -69.93, lat: 11.41 }, radius: 70000 },
  { key: 'distrito_capital', label: 'Distrito Capital', center: { lon: -66.90, lat: 10.49 }, radius: 50000 },
]

function App() {
  const [category, setCategory] = useState<string>('cena')
  const [isRunning, setIsRunning] = useState(false)
  const [current, setCurrent] = useState<Place | null>(null)
  const [winner, setWinner] = useState<Place | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Cache por region+categoria
  const [region, setRegion] = useState<RegionKey>('carabobo')
  const [remoteCache, setRemoteCache] = useState<Record<string, Place[]>>({})
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const timerRef = useRef<number | null>(null)
  const stopTimeoutRef = useRef<number | null>(null)

  const places = data as Place[]
  const localFiltered = useMemo(
    () => places.filter((p) => p.category === category),
    [places, category]
  )
  // Lista de candidatos visibles: si hay error, usar local; si no, usar remoto (puede ser []).
  const candidates = useMemo(() => {
    const key = `${region}:${category}`
    const remote = remoteCache[key] ?? []
    return error ? localFiltered : remote
  }, [remoteCache, region, category, localFiltered, error])

  const bgByCategory: Record<string, string> = {
    cena: 'from-rose-950 via-rose-900 to-rose-950',
    aventura: 'from-emerald-950 via-emerald-900 to-emerald-950',
    recreacion: 'from-sky-950 via-sky-900 to-sky-950',
    turismo: 'from-indigo-950 via-indigo-900 to-indigo-950',
    esparcimiento: 'from-amber-950 via-amber-900 to-amber-950',
    cultura: 'from-purple-950 via-purple-900 to-purple-950',
  }

  // Reset mínimo cuando cambia la categoría o la región
  useEffect(() => {
    stop()
    setWinner(null)
    setCurrent(null)
    setError(null)
    setLoading(true)
  }, [category, region])

  // Cargar remoto si no está en caché; si está, quitar loading.
  useEffect(() => {
    const key = `${region}:${category}`
    const cached = remoteCache[key]
    if (cached) {
      setLoading(false)
      return
    }
    const r = REGIONS.find((r) => r.key === region)!
    fetchPlacesByCategory(category, r.center, r.radius)
      .then((list) => {
        setRemoteCache((prev) => ({ ...prev, [key]: list }))
        setLoading(false)
      })
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : 'Error al cargar lugares'
        setError(msg)
        setLoading(false)
      })
  }, [region, category, remoteCache])

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
    if (candidates.length === 0) return
  if (winner) return // locked after winner
  if (loading) return
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

    // stop after 10 seconds and pick a final winner
    const timeoutId = window.setTimeout(() => {
      stop()
  const idx = Math.floor(Math.random() * candidates.length)
  setWinner(candidates[idx])
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
                {isRunning
                  ? `Tiempo: ${Math.min(10, elapsed)}s`
                  : loading
                  ? 'Cargando…'
                  : winner
                  ? '¡Resultado!'
                  : 'Listo'}
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
                  {winner?.name || current?.name || (loading ? 'Cargando…' : '—')}
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
                disabled={isRunning || candidates.length === 0 || !!winner || loading}
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
              <button
                onClick={() => setIsDetailsOpen(true)}
                disabled={!winner}
                className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Detalles
              </button>
            </div>
          </div>

          {/* List of candidates */}
          <div className="bg-black/30 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-lg font-semibold text-center flex-1">
                Lugares en {CATEGORIES.find((c) => c.key === category)?.label}
              </h3>
              <div className="shrink-0">
                <label className="text-sm mr-2 text-slate-300">Región:</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as RegionKey)}
                  className="bg-slate-900/60 border border-white/10 rounded-md px-2 py-1 text-sm"
                >
                  {REGIONS.map((r) => (
                    <option key={r.key} value={r.key}>{r.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {loading ? (
              <p className="text-slate-300 text-center">Cargando…</p>
            ) : error ? (
              <div>
                <p className="text-amber-300 text-center mb-2">Sin conexión a la API. Mostrando datos locales.</p>
                {localFiltered.length === 0 ? (
                  <p className="text-slate-300 text-center">No hay lugares para esta categoría.</p>
                ) : (
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {localFiltered.map((p) => (
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
            ) : candidates.length === 0 ? (
              <p className="text-slate-300 text-center">No hay lugares para esta categoría.</p>
            ) : (
              <ul className="grid sm:grid-cols-2 gap-3">
                {candidates.map((p) => (
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

      {/* Modal de detalles del lugar */}
      <Transition appear show={isDetailsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsDetailsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-slate-900 border border-white/10 p-6 text-left align-middle shadow-xl">
                  <Dialog.Title className="text-lg font-bold mb-1">{winner?.name}</Dialog.Title>
                  <p className="text-sm text-slate-300 mb-4">{winner?.city}</p>
                  {winner?.description && (
                    <p className="text-sm text-slate-200 mb-4">{winner.description}</p>
                  )}
                  {winner?.address && (
                    <p className="text-sm text-slate-300 mb-4"><span className="font-semibold">Dirección:</span> {winner.address}</p>
                  )}
                  {/* Enlace a mapa: intentar con address, si no, con name+city */}
                  {winner && (
                    <div className="mt-2 mb-4">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((winner.address || `${winner.name}, ${winner.city ?? ''}`).trim())}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-indigo-300 hover:text-indigo-200 underline"
                      >
                        Abrir en Google Maps
                      </a>
                    </div>
                  )}
                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      onClick={() => setIsDetailsOpen(false)}
                      className="px-4 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-white"
                    >
                      Cerrar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default App
