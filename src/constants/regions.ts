export type RegionKey =
  | 'carabobo'
  | 'cojedes'
  | 'aragua'
  | 'miranda'
  | 'lara'
  | 'falcon'
  | 'distrito_capital'

export type Region = {
  key: RegionKey
  label: string
  center: { lon: number; lat: number }
  radius: number
}

export const REGIONS: Region[] = [
  { key: 'carabobo', label: 'Carabobo', center: { lon: -68.0, lat: 10.166 }, radius: 60000 },
  { key: 'cojedes', label: 'Cojedes', center: { lon: -68.33, lat: 9.38 }, radius: 50000 },
  { key: 'aragua', label: 'Aragua', center: { lon: -67.59, lat: 10.24 }, radius: 60000 },
  { key: 'miranda', label: 'Miranda', center: { lon: -66.89, lat: 10.34 }, radius: 60000 },
  { key: 'lara', label: 'Lara', center: { lon: -69.35, lat: 10.07 }, radius: 60000 },
  { key: 'falcon', label: 'Falcón', center: { lon: -69.93, lat: 11.41 }, radius: 70000 },
  { key: 'distrito_capital', label: 'Distrito Capital', center: { lon: -66.90, lat: 10.49 }, radius: 50000 },
]
