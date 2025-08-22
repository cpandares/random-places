import type { Place } from '../utils/places'

type Props = {
  isRunning: boolean
  loading: boolean
  elapsed: number
  current: Place | null
  winner: Place | null
  onStart: () => void
  onStop: () => void
  onOpenDetails: () => void
  hasCandidates: boolean
}

export function Roller({
  isRunning,
  loading,
  elapsed,
  current,
  winner,
  onStart,
  onStop,
  onOpenDetails,
  hasCandidates,
}: Props) {
  return (
    <div className="bg-black/30 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Sorteo</h2>
        <div className="text-sm text-slate-300">
          {isRunning ? `Tiempo: ${Math.min(10, elapsed)}s` : loading ? 'Cargando…' : winner ? '¡Resultado!' : 'Listo'}
        </div>
      </div>

      <div className="relative h-52 overflow-hidden rounded-xl border border-white/10 bg-black/30 flex items-center justify-center">
        <div className={'text-center px-6 transition-transform duration-150 ' + (isRunning ? 'animate-pulse' : '')}>
          <div className="text-2xl sm:text-3xl font-semibold">
            {winner?.name || current?.name || (loading ? 'Cargando…' : '—')}
          </div>
          <div className="text-sm text-slate-300">{winner?.city || current?.city || ''}</div>
          {(winner || current)?.description && (
            <div className="text-xs text-slate-400 mt-1 line-clamp-2">{(winner || current)!.description}</div>
          )}
        </div>

        {winner && <div className="pointer-events-none absolute inset-0 rounded-xl ring-4 ring-emerald-400/60 animate-[ping_1s_ease-in-out_3]"></div>}
      </div>

      <div className="mt-6 flex gap-3 justify-center">
        <button
          onClick={onStart}
          disabled={isRunning || !hasCandidates || !!winner || loading}
          className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow"
        >
          {isRunning ? 'Sorteando…' : 'Iniciar (10s)'}
        </button>
        <button
          onClick={onStop}
          disabled={!isRunning || !!winner}
          className="px-5 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 font-medium"
        >
          Detener
        </button>
        <button
          onClick={onOpenDetails}
          disabled={!winner}
          className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Detalles
        </button>
      </div>
    </div>
  )
}
