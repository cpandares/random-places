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

type GeoapifyProperties = {
  place_id: string | number
  name?: string
  street?: string
  city?: string
  county?: string
  state?: string
  formatted?: string
  categories?: string[]
}

const GEOAPIFY = 'https://api.geoapify.com/v2/places'
// Usar LISTAS separadas por coma (,) y categorías válidas de Geoapify
// Catálogo ajustado a Carabobo (Valencia y Puerto Cabello) para más resultados útiles.
const categoriesMap: Record<string, string> = {
  // Cena: restaurantes + pubs/barras y cafés para ampliar opciones nocturnas
  cena: 'catering.restaurant,catering.pub,catering.bar,catering.cafe',
  // Aventura: parques temáticos, climbing, miradores, picos, playas (Puerto Cabello) y reservas
  aventura:
    'entertainment.theme_park,entertainment.activity_park.climbing,tourism.attraction.viewpoint,natural.mountain.peak,beach.beach_resort,beach,leisure.park.nature_reserve',
  // Recreación: parques, jardines, playgrounds, picnic
  recreacion: 'leisure.park,leisure.park.garden,leisure.playground,leisure.picnic.picnic_site,leisure.picnic.bbq',
  // Turismo: sitios de interés, atracciones y museos, plazas históricas, fortalezas
  turismo: 'tourism.sights,tourism.attraction,entertainment.museum,tourism.sights.square,tourism.sights.fort',
  // Esparcimiento: cine, bowling, arcades, escape rooms, spa, acuarios
  esparcimiento:
    'entertainment.cinema,entertainment.bowling_alley,entertainment.amusement_arcade,entertainment.escape_game,leisure.spa,entertainment.aquarium',
  // Cultura: teatro, galerías, centros de arte, museos y templos
  cultura:
    'entertainment.culture.theatre,entertainment.culture.gallery,entertainment.culture.arts_centre,entertainment.museum,religion.place_of_worship',
}

export async function fetchPlacesByCategory(cat: string): Promise<Place[]> {
  const categories = categoriesMap[cat] ?? 'catering.restaurant'
  // Centro aproximado: Valencia (Carabobo). Radio aumentado a 60km para incluir Puerto Cabello.
  const lon = -68.0, lat = 10.166, radius = 60000
  const apiKey = import.meta.env.VITE_GEOAPIFY_KEY
  if (!apiKey) {
    throw new Error('Falta VITE_GEOAPIFY_KEY en .env')
  }
  const url = `${GEOAPIFY}?categories=${encodeURIComponent(categories)}&filter=circle:${lon},${lat},${radius}&bias=proximity:${lon},${lat}&limit=50&lang=es&apiKey=${apiKey}`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Geoapify error: ${res.status}`)
  const json = (await res.json()) as {
    features?: Array<{ properties?: GeoapifyProperties }>
  }

  return (json.features ?? []).map((f) => {
    const p = (f && f.properties ? f.properties : {}) as GeoapifyProperties
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