"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { getMonasteryById } from "@/lib/monasteries"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapContainer, Marker, Popup, TileLayer, Polyline } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import Link from "next/link"
import {
  ArrowLeft,
  MapPin,
  LocateFixed,
  Search,
  Car,
  Footprints,
  TrainFront,
  Info,
  Loader2,
} from "lucide-react"

type Suggestion = {
  display_name: string
  lat: string
  lon: string
}

const AIRPORTS = [
  { name: "Pakyong Airport", iata: "PYG", lat: 27.2233, lon: 88.5897 },
  { name: "Bagdogra Airport", iata: "IXB", lat: 26.6812, lon: 88.3286 },
]

function haversineDistanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLon = ((b.lon - a.lon) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
  return R * c
}

function formatDuration(seconds: number) {
  if (!isFinite(seconds) || seconds <= 0) return "—"
  const totalMinutes = Math.round(seconds / 60)
  const minutesPerDay = 24 * 60
  const days = Math.floor(totalMinutes / minutesPerDay)
  const remMinutesAfterDays = totalMinutes - days * minutesPerDay
  const hours = Math.floor(remMinutesAfterDays / 60)
  const minutes = remMinutesAfterDays % 60

  if (days >= 1) {
    return `${days} days ${hours} hr ${minutes} min`
  }
  if (hours === 0) return `${minutes} min`
  return `${hours} hr ${minutes} min`
}

// Average speeds used for duration estimates
const SPEEDS = {
  carKmh: 60,
  trainKmh: 80,
  walkKmh: 3,
}

function durationSecondsFromKm(distanceKm: number, kmh: number) {
  if (!isFinite(distanceKm) || distanceKm <= 0 || !isFinite(kmh) || kmh <= 0) return NaN
  // time (hours) = distance / speed; convert to seconds
  return (distanceKm / kmh) * 3600
}

function BoundsUpdater({ points }: { points: [number, number][] }) {
  // Lazy import to avoid SSR issues; react-leaflet supplies this hook internally
  const { useMap } = require("react-leaflet")
  const map = useMap()
  useEffect(() => {
    if (points.length) {
      const b = L.latLngBounds(points as any)
      map.fitBounds(b, { padding: [40, 40] })
    }
  }, [map, points])
  return null
}

export default function DirectionsPage() {
  const params = useParams()
  const router = useRouter()
  const monastery = useMemo(() => getMonasteryById(params.id as string), [params.id])

  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [userLoc, setUserLoc] = useState<{ lat: number; lon: number; label?: string } | null>(null)
  const [routeDriving, setRouteDriving] = useState<{ coords: [number, number][]; distance: number; duration: number } | null>(null)
  const [routeWalking, setRouteWalking] = useState<{ coords: [number, number][]; distance: number; duration: number } | null>(null)
  const [loadingRoute, setLoadingRoute] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeMode, setActiveMode] = useState<"driving" | "walking">("driving")
  const [nearestAirportDyn, setNearestAirportDyn] = useState<
    | { name: string; iata?: string; lat: number; lon: number; d: number }
    | null
  >(null)

  // Directions are accessible without authentication

  useEffect(() => {
    const controller = new AbortController()
    async function search(q: string) {
      const qn = (q || "").trim().toLowerCase()
      // Do not show suggestions for the special placeholder 'My Location'
      if (qn === "my location" || qn.startsWith("my location")) {
        setSuggestions([])
        return
      }
      if (!q || q.length < 3) {
        setSuggestions([])
        return
      }
      try {
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&addressdetails=0&limit=5`,
          {
            headers: { "Accept": "application/json", "User-Agent": "sikkim-monasteries-app" },
            signal: controller.signal,
          },
        )
        if (!resp.ok) return
        const data = (await resp.json()) as Suggestion[]
        setSuggestions(data)
      } catch (e) {
        // ignore typing
      }
    }
    const t = setTimeout(() => search(query), 350)
    return () => {
      clearTimeout(t)
      controller.abort()
    }
  }, [query])

  useEffect(() => {
    async function fetchRoutes() {
      if (!userLoc || !monastery) return
      setLoadingRoute(true)
      setError(null)
      const from = `${userLoc.lon},${userLoc.lat}`
      const to = `${monastery.coordinates.lng},${monastery.coordinates.lat}`
      try {
        const [dr, wr] = await Promise.all([
          fetch(`https://router.project-osrm.org/route/v1/driving/${from};${to}?overview=full&geometries=geojson`).then(
            (r) => r.json(),
          ),
          fetch(`https://router.project-osrm.org/route/v1/foot/${from};${to}?overview=full&geometries=geojson`).then(
            (r) => r.json(),
          ),
        ])

        if (dr?.routes?.[0]) {
          const r = dr.routes[0]
          const coords: [number, number][] = r.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]])
          setRouteDriving({ coords, distance: r.distance, duration: r.duration })
        } else {
          setRouteDriving(null)
        }

        if (wr?.routes?.[0]) {
          const r = wr.routes[0]
          const coords: [number, number][] = r.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]])
          setRouteWalking({ coords, distance: r.distance, duration: r.duration })
        } else {
          setRouteWalking(null)
        }
      } catch (e) {
        setError("Could not fetch routes. Showing estimates only.")
        setRouteDriving(null)
        setRouteWalking(null)
      } finally {
        setLoadingRoute(false)
      }
    }
    fetchRoutes()
  }, [userLoc, monastery])

  // Fetch nearest airport using Overpass (dynamic, with fallback)
  useEffect(() => {
    async function fetchNearestAirport() {
      if (!monastery) return
      try {
        const lat = monastery.coordinates.lat
        const lon = monastery.coordinates.lng
        // 300km search radius
        const radius = 300000
        const overpass = `
          [out:json][timeout:25];
          (
            node["aeroway"="aerodrome"](around:${radius},${lat},${lon});
            way["aeroway"="aerodrome"](around:${radius},${lat},${lon});
            relation["aeroway"="aerodrome"](around:${radius},${lat},${lon});
          );
          out center tags 100;
        `
        const resp = await fetch(
          `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpass)}`,
          { headers: { Accept: "application/json" } },
        )
        if (!resp.ok) throw new Error("overpass failed")
        const data = await resp.json()
        const elements: any[] = data?.elements || []
        type AP = { name: string; iata?: string; lat: number; lon: number; d: number; type?: string }
        const list: AP[] = elements
          .map((el) => {
            const tags = el.tags || {}
            const n = tags.name || ""
            const iata = tags.iata || undefined
            const type = tags["aerodrome:type"] || tags["aerodrome" ] || undefined
            const latEl = el.lat ?? el.center?.lat
            const lonEl = el.lon ?? el.center?.lon
            if (latEl == null || lonEl == null) return null
            // Filter out heliports/helipads if possible
            const bad = typeof type === "string" && /heli/.test(type)
            if (!n || bad) return null
            const d = haversineDistanceKm({ lat, lon }, { lat: latEl, lon: lonEl })
            return { name: String(n), iata: iata ? String(iata) : undefined, lat: latEl, lon: lonEl, d, type }
          })
          .filter(Boolean) as AP[]

        if (list.length === 0) return
        // Prefer entries with IATA, then by distance
        list.sort((a, b) => {
          const ai = a.iata ? 0 : 1
          const bi = b.iata ? 0 : 1
          if (ai !== bi) return ai - bi
          return a.d - b.d
        })
        setNearestAirportDyn(list[0])
      } catch (e) {
        // ignore; fallback will be used
        setNearestAirportDyn(null)
      }
    }
    fetchNearestAirport()
  }, [monastery?.id])

  // No global loading screen needed; map and routes load progressively

  if (!monastery) return null

  const monasteryPoint: [number, number] = [monastery.coordinates.lat, monastery.coordinates.lng]
  const userPoint: [number, number] | null = userLoc ? [userLoc.lat, userLoc.lon] : null
  const allPoints = [monasteryPoint, ...(userPoint ? [userPoint] : [])]

  const distanceKm = userLoc
    ? haversineDistanceKm({ lat: userLoc.lat, lon: userLoc.lon }, { lat: monasteryPoint[0], lon: monasteryPoint[1] })
    : null

  // Prefer route distance for summary when available
  const summaryDistanceKm = routeDriving
    ? routeDriving.distance / 1000
    : routeWalking
    ? routeWalking.distance / 1000
    : distanceKm ?? null

  // Compute durations using fixed average speeds; when route distances are available, prefer them
  const drivingDuration = routeDriving
    ? durationSecondsFromKm(routeDriving.distance / 1000, SPEEDS.carKmh)
    : distanceKm
    ? durationSecondsFromKm(distanceKm, SPEEDS.carKmh)
    : NaN

  const walkingDuration = routeWalking
    ? durationSecondsFromKm(routeWalking.distance / 1000, SPEEDS.walkKmh)
    : distanceKm
    ? durationSecondsFromKm(distanceKm, SPEEDS.walkKmh)
    : NaN

  const trainDuration = summaryDistanceKm ? durationSecondsFromKm(summaryDistanceKm, SPEEDS.trainKmh) : NaN

  const nearestAirportFallback = AIRPORTS.map((a) => ({
    ...a,
    d: haversineDistanceKm({ lat: monasteryPoint[0], lon: monasteryPoint[1] }, { lat: a.lat, lon: a.lon }),
  }))
    .sort((x, y) => x.d - y.d)[0]

  const displayAirport = nearestAirportDyn ?? nearestAirportFallback

  const markerIcon = L.icon({
    iconUrl: "/marker-red-3d.svg",
    iconRetinaUrl: "/marker-red-3d.svg",
    iconSize: [36, 54],
    iconAnchor: [18, 52],
    popupAnchor: [0, -44],
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div
        className="relative h-48 w-full overflow-hidden"
        style={{ backgroundImage: `url(${monastery.images[0] ?? "/placeholder.jpg"})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-7xl mx-auto h-full flex items-center px-4 sm:px-6 lg:px-8">
          <div>
            <Badge variant="secondary" className="mb-2">Directions</Badge>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{monastery.name}</h1>
            <div className="flex items-center gap-2 text-white/90 mt-1">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{monastery.location}, {monastery.district}</span>
            </div>
          </div>
          <div className="ml-auto">
            <Button variant="secondary" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Location input */}
  <Card className="relative z-[1200]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Search className="h-5 w-5" /> Your Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Input
                    placeholder="Search your address or place..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute z-[1300] mt-1 w-full rounded-md border bg-background shadow max-h-72 overflow-auto">
                      {suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          className="w-full text-left px-3 py-2 hover:bg-accent"
                          onClick={() => {
                            setUserLoc({ lat: parseFloat(s.lat), lon: parseFloat(s.lon), label: s.display_name })
                            setQuery(s.display_name)
                            setSuggestions([])
                          }}
                        >
                          {s.display_name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (!navigator.geolocation) return
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        setUserLoc({ lat: pos.coords.latitude, lon: pos.coords.longitude, label: "My Location" })
                        setQuery("My Location")
                      },
                      () => {},
                      { enableHighAccuracy: true, timeout: 8000 },
                    )
                  }}
                  className="flex items-center gap-2"
                >
                  <LocateFixed className="h-4 w-4" /> Use my location
                </Button>
                {userLoc && (
                  <Button variant="ghost" onClick={() => { setUserLoc(null); setQuery("") }}>Clear</Button>
                )}
              </div>
            </div>
            {error && (
              <div className="mt-3 text-sm text-amber-600 flex items-center gap-2"><Info className="h-4 w-4" /> {error}</div>
            )}
          </CardContent>
        </Card>

        {/* Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div className="w-full h-full min-h-[420px]">
            <MapContainer
              bounds={L.latLngBounds(allPoints as any) as any}
              className="h-full w-full rounded-lg overflow-hidden"
              zoom={9}
              scrollWheelZoom
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution={"&copy; OpenStreetMap contributors" as any} />
              <Marker position={monasteryPoint as any} icon={markerIcon as any}>
                <Popup>
                  <div>
                    <div className="font-medium">{monastery.name}</div>
                    <div className="text-xs text-muted-foreground">{monastery.location}</div>
                    <Link href={`/monastery/${monastery.id}`} className="text-primary text-xs underline">View details</Link>
                  </div>
                </Popup>
              </Marker>
              {userPoint && (
                <Marker position={userPoint as any} icon={L.icon({ iconUrl: "/marker-red.svg", iconSize: [28, 42], iconAnchor: [14, 40] }) as any}>
                  <Popup>{userLoc?.label ?? "Your location"}</Popup>
                </Marker>
              )}

              {activeMode === "driving" && routeDriving?.coords && (
                <Polyline positions={routeDriving.coords as any} pathOptions={{ color: "#c1121f", weight: 4 }} />
              )}
              {activeMode === "walking" && routeWalking?.coords && (
                <Polyline positions={routeWalking.coords as any} pathOptions={{ color: "#0d6efd", weight: 4 }} />
              )}
              {activeMode === "driving" && !routeDriving?.coords && routeWalking?.coords && (
                <Polyline positions={routeWalking.coords as any} pathOptions={{ color: "#6c757d", weight: 4, dashArray: "6 6" }} />
              )}
              {activeMode === "walking" && !routeWalking?.coords && routeDriving?.coords && (
                <Polyline positions={routeDriving.coords as any} pathOptions={{ color: "#6c757d", weight: 4, dashArray: "6 6" }} />
              )}
              {!routeDriving?.coords && !routeWalking?.coords && loadingRoute && (
                // subtle placeholder path style when loading
                <></>
              )}

              <BoundsUpdater points={allPoints} />
            </MapContainer>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" /> Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">From: {userLoc?.label ?? "—"}</div>
                <div className="text-sm text-muted-foreground">To: {monastery.name}</div>
                <div className="text-lg font-semibold">{summaryDistanceKm ? summaryDistanceKm.toFixed(1) : "—"} km away</div>
                {loadingRoute && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Fetching routes…
                  </div>
                )}
                {/* Removed speed badges per request */}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className={activeMode === "driving" ? "ring-2 ring-primary" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Car className="h-5 w-5" /> By Car</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground text-sm">{routeDriving ? (routeDriving.distance / 1000).toFixed(1) : distanceKm?.toFixed(1) ?? "—"} km</div>
                  <div className="text-lg font-semibold">{formatDuration(drivingDuration)}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => setActiveMode("driving")}>Show on map</Button>
                    <Button size="sm" asChild>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${userPoint ? userPoint.join(",") : ""}&destination=${monasteryPoint.join(",")}&travelmode=driving`}
                        target="_blank"
                        rel="noreferrer"
                      >Google Maps</a>
                    </Button>
                    <Button size="sm" variant="secondary" asChild>
                      <a
                        href={`http://maps.apple.com/?saddr=${userPoint ? userPoint.join(",") : ""}&daddr=${monasteryPoint.join(",")}&dirflg=d`}
                        target="_blank"
                        rel="noreferrer"
                      >Apple Maps</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className={activeMode === "walking" ? "ring-2 ring-primary" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Footprints className="h-5 w-5" /> By Walk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground text-sm">{routeWalking ? (routeWalking.distance / 1000).toFixed(1) : distanceKm?.toFixed(1) ?? "—"} km</div>
                  <div className="text-lg font-semibold">{formatDuration(walkingDuration)}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => setActiveMode("walking")}>Show on map</Button>
                    <Button size="sm" asChild>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${userPoint ? userPoint.join(",") : ""}&destination=${monasteryPoint.join(",")}&travelmode=walking`}
                        target="_blank"
                        rel="noreferrer"
                      >Google Maps</a>
                    </Button>
                    <Button size="sm" variant="secondary" asChild>
                      <a
                        href={`http://maps.apple.com/?saddr=${userPoint ? userPoint.join(",") : ""}&daddr=${monasteryPoint.join(",")}&dirflg=w`}
                        target="_blank"
                        rel="noreferrer"
                      >Apple Maps</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><TrainFront className="h-5 w-5" /> By Train</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground text-sm">{summaryDistanceKm ? summaryDistanceKm.toFixed(1) : "—"} km</div>
                  <div className="text-lg font-semibold">{formatDuration(trainDuration)}</div>
                  <div className="text-xs text-muted-foreground mt-1">Estimated using average speed; actual routes may vary.</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" /> Nearest Airport</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold">
                    {displayAirport ? `${displayAirport.name}${displayAirport.iata ? ` (${displayAirport.iata})` : ""}` : "—"}
                  </div>
                  {displayAirport && (
                    <div className="text-sm text-muted-foreground">{displayAirport.d.toFixed(1)} km from monastery</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to details
          </Button>
          <Button asChild>
            <Link href={`https://www.openstreetmap.org/directions?from=&to=${monasteryPoint[0]},${monasteryPoint[1]}`} target="_blank">Open in OpenStreetMap</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
