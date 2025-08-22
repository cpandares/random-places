export type Category = { key: string; label: string }

export const CATEGORIES: Category[] = [
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

export const bgByCategory: Record<string, string> = {
  cena: 'from-rose-950 via-rose-900 to-rose-950',
  aventura: 'from-emerald-950 via-emerald-900 to-emerald-950',
  recreacion: 'from-sky-950 via-sky-900 to-sky-950',
  turismo: 'from-indigo-950 via-indigo-900 to-indigo-950',
  esparcimiento: 'from-amber-950 via-amber-900 to-amber-950',
  cultura: 'from-purple-950 via-purple-900 to-purple-950',
}
