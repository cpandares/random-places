import type { Category } from '../constants/categories'

type Props = {
  categories: Category[]
  value: string
  onChange: (key: string) => void
  disabled?: boolean
}

export function CategoryMenu({ categories, value, onChange, disabled }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
      {categories.map((c) => (
        <button
          key={c.key}
          onClick={() => onChange(c.key)}
          disabled={disabled}
          className={
            'px-4 py-2 rounded-full border transition focus:outline-none focus:ring-2 focus:ring-emerald-400 ' +
            (value === c.key
              ? 'bg-emerald-500 border-emerald-400 text-white shadow'
              : 'bg-slate-900/40 border-slate-800 hover:border-slate-600 disabled:opacity-40')
          }
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}
