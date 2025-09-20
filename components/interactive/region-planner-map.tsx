"use client"

import { useEffect, useMemo, useState } from "react"
// Lazy-load react-leaflet/leaflet in client to avoid SSR issues
import "leaflet/dist/leaflet.css"
let RL: any = null
let Lref: any = null
async function ensureLeaflet(): Promise<void> {
  if (typeof window === "undefined") return
  if (!RL) {
    const mod = await import("react-leaflet")
    RL = mod
  }
  if (!Lref) {
    const mod = await import("leaflet")
    Lref = (mod as any).default ?? mod
  }
}

type LatLngExpression = [number, number]

import { monasteries, Monastery } from "@/lib/monasteries"
import { trekRoutes, type POI } from "@/lib/poi"
import { regions, type Region } from "@/lib/regions"
import { withinKm, sortByDistance, haversineKm } from "@/lib/utils"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Route, Navigation } from "lucide-react"

type Category = "monastery" | "attraction" | "hotel" | "homestay" | "restaurant" | "transport"

const categoryColors: Record<Category, string> = {
  monastery: "#c026d3",
  attraction: "#2563eb",
  hotel: "#16a34a",
  homestay: "#059669",
  restaurant: "#ea580c",
  transport: "#0ea5e9",
}

const iconCache: Record<string, any> = {}
const ICON_SIZE: [number, number] = [24, 36]
const ICON_ANCHOR: [number, number] = [12, 34]
const POPUP_ANCHOR: [number, number] = [0, -28]
function markerSvgDataUrl(color: string) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="54" viewBox="0 0 24 36">
    <path fill="${color}" d="M12 0c-6.6 0-12 5.3-12 12 0 8.6 12 24 12 24s12-15.4 12-24C24 5.3 18.6 0 12 0z"/>
    <circle cx="12" cy="12" r="5" fill="white"/>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
function getIcon(cat: Category) {
  if (!Lref) return undefined as any
  const color = categoryColors[cat]
  if (!iconCache[color]) {
    const url = markerSvgDataUrl(color)
    iconCache[color] = Lref.icon({
      iconUrl: url,
      iconRetinaUrl: url,
      iconSize: ICON_SIZE,
      iconAnchor: ICON_ANCHOR,
      popupAnchor: POPUP_ANCHOR,
      className: `leaflet-marker-${cat}`,
    })
  }
  return iconCache[color]
}

function regionOf(m: Monastery): Region | null {
  const d = m.district
  if (d.includes("East")) return "East Sikkim"
  if (d.includes("West")) return "West Sikkim"
  if (d.includes("North")) return "North Sikkim"
  if (d.includes("South")) return "South Sikkim"
  return null
}

type ItineraryItem = {
  id: string
  name: string
  coordinates: { lat: number; lng: number }
  kind: "monastery" | "poi"
}

export function RegionPlannerMap() {
  const [region, setRegion] = useState<Region>("West Sikkim")
  const [radiusKm, setRadiusKm] = useState<number>(5)
  const [leafletReady, setLeafletReady] = useState(false)
  const [enabled, setEnabled] = useState<Record<Category, boolean>>({
    monastery: true,
    attraction: true,
    hotel: true,
    homestay: true,
    restaurant: true,
    transport: true,
  })
  const [selectedMonastery, setSelectedMonastery] = useState<Monastery | null>(null)
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [fetched, setFetched] = useState<{
    monastery: Array<{ id: string; name: string; coordinates: { lat: number; lng: number }; tags?: Record<string, string> }>
    attraction: Array<{ id: string; name: string; coordinates: { lat: number; lng: number }; tags?: Record<string, string> }>
    hotel: Array<{ id: string; name: string; coordinates: { lat: number; lng: number }; tags?: Record<string, string> }>
    homestay: Array<{ id: string; name: string; coordinates: { lat: number; lng: number }; tags?: Record<string, string> }>
    restaurant: Array<{ id: string; name: string; coordinates: { lat: number; lng: number }; tags?: Record<string, string> }>
    transport: Array<{ id: string; name: string; coordinates: { lat: number; lng: number }; tags?: Record<string, string> }>
  } | null>(null)

  const regionMonasteries = useMemo(() => monasteries.filter((m) => regionOf(m) === region), [region])

  const center: LatLngExpression = useMemo(() => {
    if (!regionMonasteries.length) return [27.5, 88.4]
    const lat = regionMonasteries.reduce((s, m) => s + m.coordinates.lat, 0) / regionMonasteries.length
    const lng = regionMonasteries.reduce((s, m) => s + m.coordinates.lng, 0) / regionMonasteries.length
    return [lat, lng]
  }, [regionMonasteries])

  const regionPOIs = useMemo(() => {
    if (!fetched) return [] as POI[]
    const list: POI[] = [] as any
    ;(["attraction","hotel","homestay","restaurant","transport"] as Category[]).forEach((c) => {
      ;(fetched as any)[c].forEach((p: any) => list.push({ id: p.id, name: p.name, coordinates: p.coordinates, category: c, region, tags: p.tags }))
    })
    return list
  }, [fetched, region])
  const regionTreks = useMemo(() => trekRoutes.filter((t) => t.region === region), [region])

  const nearbyByCategory = useMemo(() => {
    if (!selectedMonastery) return {}
    const origin = selectedMonastery.coordinates
    const nearby = withinKm(origin, regionPOIs, radiusKm)
    return nearby.reduce<Record<Category, POI[]>>((acc: Record<Category, POI[]>, p: POI) => {
      const cat = p.category as Category
      acc[cat] = acc[cat] || []
      acc[cat].push(p)
      return acc
    }, {} as Record<Category, POI[]>)
  }, [selectedMonastery, regionPOIs, radiusKm])

  // Limit markers to 5km around selected monastery
  const nearbyPOIs = useMemo(() => {
    if (!selectedMonastery) return [] as POI[]
    return withinKm(selectedMonastery.coordinates, regionPOIs, radiusKm)
  }, [selectedMonastery, regionPOIs, radiusKm])

  // Only show the selected monastery marker on the map; others are hidden.

  useEffect(() => {
    setSelectedMonastery(regionMonasteries[0] ?? null)
  }, [region, regionMonasteries])

  useEffect(() => {
    let active = true
    setMounted(true)
    ;(async () => {
      try {
        await ensureLeaflet()
        if (active) setLeafletReady(true)
      } catch {
        if (active) setLeafletReady(false)
      }
    })()
    return () => { active = false }
  }, [])

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const r = await fetch(`/api/poi?region=${encodeURIComponent(region)}`, { cache: "no-store" })
        if (!r.ok) throw new Error(`POI fetch failed: ${r.status}`)
        const j = await r.json()
        if (!active) return
        setFetched({
          monastery: j.monastery || [],
          attraction: j.attraction || [],
          hotel: j.hotel || [],
          homestay: j.homestay || [],
          restaurant: j.restaurant || [],
          transport: j.transport || [],
        })
      } catch (e: any) {
        if (!active) return
        setError(e?.message || "Failed to load POIs")
        setFetched(null)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [region])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Plan by Region</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={region} onValueChange={(v) => setRegion(v as Region)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {regions.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(enabled) as Category[]).map((c) => (
                <label key={c} className="flex items-center gap-2 text-xs">
                  <Switch checked={enabled[c]} onCheckedChange={(v: boolean) => setEnabled((e) => ({ ...e, [c]: v }))} />
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColors[c] }} />
                    {c}
                  </span>
                </label>
              ))}
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-medium">Nearby Radius</span>
                <span>{radiusKm} km</span>
              </div>
              <Slider
                value={[radiusKm]}
                min={1}
                max={20}
                step={1}
                onValueChange={(v) => setRadiusKm(v[0])}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Monasteries in {region}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-80 overflow-auto">
            {regionMonasteries.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMonastery(m)}
                className={`w-full text-left p-2 rounded border ${selectedMonastery?.id === m.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.location}</div>
                  </div>
                  <Badge variant="secondary">{m.district}</Badge>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {selectedMonastery && (
          <Card>
            <CardHeader>
        <CardTitle className="text-sm">Nearby to {selectedMonastery.name} (≤ {radiusKm}km)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-80 overflow-auto">
              {(Object.keys(nearbyByCategory) as Category[])
                .filter((c) => c !== "transport" && c !== "homestay")
                .map((c) => (
                enabled[c] && (
                  <div key={c}>
                    <div className="text-xs font-medium capitalize mb-1" style={{ color: categoryColors[c] }}>{c}</div>
                    {sortByDistance(selectedMonastery.coordinates, ((nearbyByCategory as Record<Category, POI[]>)[c] || [])).map((p) => (
                      <div key={p.id} className="text-xs text-muted-foreground mb-1">• {p.name}</div>
                    ))}
                  </div>
                )
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Itinerary ({itinerary.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {itinerary.length === 0 && <div className="text-xs text-muted-foreground">Add monasteries and places from the map popups.</div>}
            {itinerary.map((it, idx) => (
              <div key={it.id} className="flex items-center justify-between text-xs border rounded p-2">
                <div>
                  <div className="font-medium">{idx + 1}. {it.name}</div>
                  <div className="text-muted-foreground">{it.kind}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setItinerary((arr) => arr.filter((x) => x.id !== it.id))}>Remove</Button>
                </div>
              </div>
            ))}
            {itinerary.length >= 2 && (
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs">
                  Total distance: {(() => {
                    let d = 0
                    for (let i = 0; i < itinerary.length - 1; i++) {
                      d += haversineKm(itinerary[i].coordinates, itinerary[i + 1].coordinates)
                    }
                    return d.toFixed(1)
                  })()} km
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setItinerary((arr) => {
                    if (arr.length < 3) return arr
                    const start = arr[0]
                    const rest = arr.slice(1)
                    const ordered: ItineraryItem[] = [start]
                    const remaining = [...rest]
                    while (remaining.length) {
                      const last = ordered[ordered.length - 1]
                      let bestIdx = 0
                      let bestDist = Infinity
                      for (let i = 0; i < remaining.length; i++) {
                        const dist = haversineKm(last.coordinates, remaining[i].coordinates)
                        if (dist < bestDist) { bestDist = dist; bestIdx = i }
                      }
                      ordered.push(remaining.splice(bestIdx, 1)[0])
                    }
                    return ordered
                  })}>Optimize</Button>
                  <a
                    className="inline-flex items-center text-xs underline"
                    target="_blank"
                    href={`https://www.openstreetmap.org/directions?from=${itinerary[0].coordinates.lat},${itinerary[0].coordinates.lng}&to=${itinerary[itinerary.length - 1].coordinates.lat},${itinerary[itinerary.length - 1].coordinates.lng}`}
                  >
                    Open start → end
                  </a>
                </div>
              </div>
            )}
            {itinerary.length > 0 && (
              <div className="pt-2">
                <Button variant="ghost" size="sm" onClick={() => setItinerary([])}>Clear</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="min-h-[500px] h-[calc(100vh-8rem)] pt-0 pb-0">
          <CardContent className="p-0 h-full">
            {error && (
              <div className="p-2 text-xs text-amber-600">{error} (showing limited data)</div>
            )}
            {loading && (
              <div className="absolute z-[1000] m-2 px-2 py-1 rounded bg-white/90 text-xs text-muted-foreground border">
                Loading places for {region}…
              </div>
            )}
            {mounted && leafletReady && (
            <RL.MapContainer center={center as any} zoom={9} className="h-full w-full rounded-lg overflow-hidden">
              <RL.TileLayer
                attribution={"&copy; OpenStreetMap contributors" as any}
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Monasteries */}
              {selectedMonastery && (
                <RL.Marker key={selectedMonastery.id} position={[selectedMonastery.coordinates.lat, selectedMonastery.coordinates.lng] as any} icon={getIcon("monastery")}>
                  <RL.Popup>
                    <div className="space-y-1">
                      <div className="font-medium">{selectedMonastery.name}</div>
                      <div className="text-xs text-muted-foreground">{selectedMonastery.location}</div>
                      <div className="flex gap-2 pt-1">
                        <Link href={`/monastery/${selectedMonastery.id}`} className="text-primary text-xs underline">Details</Link>
                        <Link href={`/monastery/${selectedMonastery.id}/tour`} className="text-primary text-xs underline">Virtual Tour</Link>
                      </div>
                      <div className="pt-2 flex gap-2">
                        <Link href={`/monastery/${selectedMonastery.id}/directions`} className="inline-flex items-center text-xs text-primary underline">
                          <Route className="h-3 w-3 mr-1" /> Directions
                        </Link>
                        <a href={`https://www.openstreetmap.org/directions?from=&to=${selectedMonastery.coordinates.lat},${selectedMonastery.coordinates.lng}`} target="_blank" className="inline-flex items-center text-xs text-primary underline">
                          <Navigation className="h-3 w-3 mr-1" /> OSM
                        </a>
                      </div>
                    </div>
                  </RL.Popup>
                </RL.Marker>
              )}

              {/* Additional monasteries from OSM not in our local list (by proximity) */}
              {/* OSM monastery markers intentionally hidden to only show the selected monastery */}

              {/* POIs */}
              {nearbyPOIs.filter((p) => enabled[p.category as Category]).map((p) => (
                <RL.Marker key={p.id} position={[p.coordinates.lat, p.coordinates.lng] as any} icon={getIcon(p.category as Category)}>
                  <RL.Popup>
                    <div className="space-y-1">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{p.category}</div>
                      {p.url && (
                        <a href={p.url} target="_blank" className="text-primary text-xs underline">More info</a>
                      )}
                      <div className="pt-2">
                        <Button size="sm" variant="outline" onClick={() => setItinerary((arr) => arr.find((x) => x.id === p.id) ? arr : [...arr, { id: p.id, name: p.name, coordinates: p.coordinates, kind: "poi" }])}>Add to plan</Button>
                      </div>
                    </div>
                  </RL.Popup>
                </RL.Marker>
              ))}

              {/* Trekking routes */}
              {regionTreks.map((t) => (
                <RL.Polyline key={t.id} positions={t.polyline.map((p) => [p.lat, p.lng]) as any} color="#16a34a" weight={4} opacity={0.7} />
              ))}

              {/* Itinerary path (straight lines between points) */}
              {itinerary.length >= 2 && (
                <RL.Polyline
                  positions={itinerary.map((it) => [it.coordinates.lat, it.coordinates.lng]) as any}
                  color="#ef4444"
                  weight={3}
                  opacity={0.8}
                />
              )}
            </RL.MapContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
