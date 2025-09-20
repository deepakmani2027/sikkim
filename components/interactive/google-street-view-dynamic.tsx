"use client"

import { useEffect, useRef, useState } from "react"

type Props = {
  lat: number
  lng: number
  placeName?: string
  radiusMeters?: number
  heading?: number
  pitch?: number
  zoom?: number
  className?: string
  height?: string | number
}

declare global {
  interface Window {
    google?: any
    __googleMapsScriptLoaded?: boolean
    __googleMapsScriptPromise?: Promise<void>
  }
}

export function GoogleStreetViewDynamic({
  lat,
  lng,
  placeName,
  radiusMeters = 800,
  heading = 0,
  pitch = 0,
  zoom = 1,
  className = "",
  height = "70vh",
}: Props) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let cancelled = false

    async function ensureScript(): Promise<void> {
      if ((window as any).google?.maps) return
      if (window.__googleMapsScriptLoaded) return
      if (window.__googleMapsScriptPromise) return window.__googleMapsScriptPromise
      if (!key) return
      const src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=quarterly`
      window.__googleMapsScriptPromise = new Promise<void>((resolve, reject) => {
        const script = document.createElement("script")
        script.src = src
        script.async = true
        script.defer = true
        script.onload = () => {
          window.__googleMapsScriptLoaded = true
          resolve()
        }
        script.onerror = () => reject(new Error("Failed to load Google Maps JS API"))
        document.head.appendChild(script)
      })
      return window.__googleMapsScriptPromise
    }

    async function resolveMonasteryCoords(): Promise<{ lat: number; lng: number } | null> {
      if (!placeName) return null
      try {
        const bias = `${lat},${lng}`
        const res = await fetch(
          `/api/services/places?find=${encodeURIComponent(placeName)}&type=point_of_interest&near=${bias}&radius=${Math.max(
            600,
            radiusMeters
          )}`
        )
        const j = await res.json()
        const cand = j.results?.[0]
        if (cand?.location?.lat && cand?.location?.lng) return { lat: cand.location.lat, lng: cand.location.lng }
      } catch {}
      return null
    }

    async function init() {
      try {
        setLoading(true)
        setError(null)
        if (!key) {
          setError("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY")
          setLoading(false)
          return
        }

        await ensureScript()
        if (cancelled) return

        const g = (window as any).google
        if (!g?.maps) throw new Error("Google Maps not available")

        const sv = new g.maps.StreetViewService()
        const resolved = await resolveMonasteryCoords()
        const baseLat = resolved?.lat ?? lat
        const baseLng = resolved?.lng ?? lng
        const loc = new g.maps.LatLng(baseLat, baseLng)

        // Try tight radii to keep pano within monastery bounds
        const tryRadii = [120, 250, 400, 600]
        const tryNext = (idx: number) => {
          if (idx >= tryRadii.length) {
            setError("No Street View imagery at this monastery")
            setLoading(false)
            return
          }
          const rad = tryRadii[idx]
          sv.getPanorama({ location: loc, radius: rad }, (data: any, status: string) => {
            if (cancelled) return
            if (status === "OK" && data) {
              const panoOptions: any = {
                pano: data.location.pano,
                pov: { heading, pitch },
                zoom,
                addressControl: false,
                fullscreenControl: true,
                linksControl: true,
                motionTracking: false,
                motionTrackingControl: false,
              }
              if (containerRef.current) {
                // eslint-disable-next-line no-new
                new g.maps.StreetViewPanorama(containerRef.current, panoOptions)
              }
              setLoading(false)
              return
            }
            tryNext(idx + 1)
          })
        }

        tryNext(0)
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || "Failed to initialize Street View")
          setLoading(false)
        }
      }
    }

    init()
    return () => {
      cancelled = true
    }
    // Only re-run when key or inputs change
  }, [lat, lng, placeName, radiusMeters, heading, pitch, zoom, key])

  const panoLink = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`

  return (
    <div className={className} style={{ width: "100%", height }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%", border: 0, position: "relative" }} />
      {!key && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
          <div className="text-center text-sm">
            <div className="mb-2">Google Maps key missing for Street View.</div>
            <a href={panoLink} target="_blank" rel="noreferrer" className="underline text-primary">
              Open Street View in Google Maps
            </a>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
          <div className="text-center text-sm">
            <div className="mb-2">{error}</div>
            <a href={panoLink} target="_blank" rel="noreferrer" className="underline text-primary">
              Open in Google Maps
            </a>
          </div>
        </div>
      )}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-sm opacity-70">Loading Street View…</div>
        </div>
      )}
    </div>
  )
}
