import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type LatLng = { lat: number; lng: number }

export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLon = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const sinDLat = Math.sin(dLat / 2)
  const sinDLon = Math.sin(dLon / 2)
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
  return R * c
}

export function withinKm<T extends { coordinates: LatLng }>(origin: LatLng, items: T[], km: number): T[] {
  return items.filter((it) => haversineKm(origin, it.coordinates) <= km)
}

export function sortByDistance<T extends { coordinates: LatLng }>(origin: LatLng, items: T[]): T[] {
  return [...items].sort((a, b) => haversineKm(origin, a.coordinates) - haversineKm(origin, b.coordinates))
}
