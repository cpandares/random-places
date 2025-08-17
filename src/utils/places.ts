// utils/places.ts
export type Place = {
  id: string
  name: string
  category: string
  city?: string
  description?: string
  address?: string
  priceRange?: string
  difficulty?: string
}

const GEOAPIFY = 'https://api.geoapify.com/v2/places'
const categoriesMap: Record<string, string> = {
  cena: 'catering.restaurant',
  aventura: 'sport.climbing|entertainment.theme_park|sport.hiking',
  recreacion: 'leisure.park|leisure.playground',
  turismo: 'tourism.sights|tourism.museum',
  esparcimiento: 'entertainment.cinema|leisure.park',
  cultura: 'entertainment.museum|entertainment.theatre',
}

export async function fetchPlacesByCategory(cat: string): Promise<Place[]> {
  const categories = categoriesMap[cat] ?? 'catering.restaurant'
  const lon = -68.0, lat = 10.166, radius = 30000 // 30km alrededor de Valencia
  const url = `${GEOAPIFY}?categories=${encodeURIComponent(categories)}&filter=circle:${lon},${lat},${radius}&bias=proximity:${lon},${lat}&limit=50&apiKey=${import.meta.env.VITE_GEOAPIFY_KEY}`

  const res = await fetch(url)
  if (!res.ok) throw new Error('Geoapify error')
  const json = await res.json()

  return (json.features ?? []).map((f: any) => {
    const p = f.properties || {}
    return {
      id: String(p.place_id),
      name: p.name || p.street || 'Sin nombre',
      category: cat,
      city: p.city || p.county || p.state,
      address: p.formatted,
      description: p.categories?.join(', ')
    } as Place
  })
}