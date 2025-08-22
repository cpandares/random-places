import type { Place } from '../utils/places'
import type { RegionKey } from '../constants/regions'
import { REGIONS } from '../constants/regions'

type Props = {
  title: string
  loading: boolean
  error: string | null
  candidates: Place[]
  localFallback: Place[]
  selectedRegion: RegionKey
  onChangeRegion: (r: RegionKey) => void
  winnerId?: string
}

export function CandidateList({
  title,
  loading,
  error,
  candidates,
  localFallback,
  selectedRegion,
  onChangeRegion,
  winnerId,
}: Props) {
  const renderList = (list: Place[]) => (
    <ul className="grid sm:grid-cols-2 gap-3">
      {list.map((p) => (
        <li
          key={p.id}
          className={
            'p-3 rounded-lg border transition text-center ' +
            (winnerId === p.id ? 'border-emerald-400 bg-emerald-500/10' : 'border-white/10 bg-black/30 hover:bg-black/40')
          }
        >
          <div className="font-medium">{p.name}</div>
          <div className="text-xs text-slate-400">{p.city}</div>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="bg-black/30 border border-white/10 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-center flex-1">{title}</h3>
        <div className="shrink-0">
          <label className="text-sm mr-2 text-slate-300">Región:</label>
          <select
            value={selectedRegion}
            onChange={(e) => onChangeRegion(e.target.value as RegionKey)}
            className="bg-slate-900/60 border border-white/10 rounded-md px-2 py-1 text-sm"
          >
            {REGIONS.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-300 text-center">Cargando…</p>
      ) : error ? (
        <div>
          <p className="text-amber-300 text-center mb-2">Sin conexión a la API. Mostrando datos locales.</p>
          {localFallback.length === 0 ? (
            <p className="text-slate-300 text-center">No hay lugares para esta categoría.</p>
          ) : (
            renderList(localFallback)
          )}
        </div>
      ) : candidates.length === 0 ? (
        <p className="text-slate-300 text-center">No hay lugares para esta categoría.</p>
      ) : (
        renderList(candidates)
      )}
    </div>
  )
}
