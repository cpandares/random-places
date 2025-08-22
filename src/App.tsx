import { useEffect, useMemo, useState } from 'react'
import confetti from 'canvas-confetti'
import data from './data/random.json'
import { fetchPlacesByCategory, type Place } from './utils/places'
import { CATEGORIES, bgByCategory } from './constants/categories'
import { REGIONS, type RegionKey } from './constants/regions'
import { useRoller } from './hooks/useRoller'
import { CategoryMenu } from './components/CategoryMenu'
import { Roller } from './components/Roller'
import { CandidateList } from './components/CandidateList'
import { PlaceDetailsModal } from './components/PlaceDetailsModal'

function App() {
  const [category, setCategory] = useState<string>('cena')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [region, setRegion] = useState<RegionKey>('carabobo')
  const [remoteCache, setRemoteCache] = useState<Record<string, Place[]>>({})
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

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

  // Roller hook controls current, winner, timers usando candidatos actuales
  const { isRunning, current, winner, elapsed, start, stop, resetWinner } = useRoller(candidates, loading)

  // Reset mínimo cuando cambia la categoría o la región
  useEffect(() => {
    stop()
    resetWinner()
    setError(null)
    setLoading(true)
  }, [category, region, stop, resetWinner])

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
      confetti({ ...defaults, particleCount: 70, origin: { x: randomInRange(0.1, 0.3), y: Math.random() * 0.2 + 0.1 } })
      confetti({ ...defaults, particleCount: 70, origin: { x: randomInRange(0.7, 0.9), y: Math.random() * 0.2 + 0.1 } })
    }, 250)
    return () => window.clearInterval(confettiInterval)
  }, [winner])

  // No extra hook instance; already synced via hook args

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${bgByCategory[category] ?? 'from-slate-950 via-slate-900 to-slate-950'} text-slate-100 flex flex-col items-center justify-center`}>
      <header className="w-full max-w-4xl px-6 sm:px-8 py-8 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Random Places • {CATEGORIES.find((c) => c.key === category)?.label || 'Sorteo'}
        </h1>
        <p className="text-slate-300 mt-2">Elige una categoría y deja que la suerte decida.</p>
      </header>

      <main className="w-full max-w-4xl px-6 sm:px-8 pb-14 flex flex-col items-center">
        <CategoryMenu categories={CATEGORIES} value={category} onChange={setCategory} disabled={isRunning || !!winner} />

        <section className="grid w-full gap-6 md:grid-cols-2 items-stretch">
          <Roller
            isRunning={isRunning}
            loading={loading}
            elapsed={elapsed}
            current={current}
            winner={winner}
            onStart={start}
            onStop={stop}
            onOpenDetails={() => setIsDetailsOpen(true)}
            hasCandidates={candidates.length > 0}
          />

          <CandidateList
            title={`Lugares en ${CATEGORIES.find((c) => c.key === category)?.label ?? ''}`}
            loading={loading}
            error={error}
            candidates={candidates}
            localFallback={localFiltered}
            selectedRegion={region}
            onChangeRegion={(r) => setRegion(r)}
            winnerId={winner?.id}
          />
        </section>
      </main>

      <PlaceDetailsModal open={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} place={winner} />
    </div>
  )
}

export default App
