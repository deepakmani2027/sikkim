"use client"

import { useEffect, useMemo, useState } from "react"

type Props = {
	name: string
	lat: number
	lng: number
	max?: number
}

type Photo = { ref: string; width: number; height: number; attributions?: string[] }

export function GooglePhotosGrid({ name, lat, lng, max = 12 }: Props) {
	const [photos, setPhotos] = useState<Photo[] | null>(null)
	const [placeId, setPlaceId] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const [limit, setLimit] = useState<number>(max)

	const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

	const photoUrl = (ref: string, w: number) =>
		`https://maps.googleapis.com/maps/api/place/photo?maxwidth=${Math.min(1600, Math.max(400, w))}&photo_reference=${encodeURIComponent(
			ref
		)}&key=${encodeURIComponent(apiKey)}`

	useEffect(() => {
		let active = true
		async function run() {
			try {
				setLoading(true)
				setError(null)
				// Find the place by text near the monastery coordinates
				const findRes = await fetch(
					`/api/services/places?find=${encodeURIComponent(name)}&type=point_of_interest&near=${lat},${lng}&radius=1500`
				)
				const found = await findRes.json()
				const cand = found.results?.[0]
				if (!cand?.id) throw new Error("Place not found")
				if (!active) return
				setPlaceId(cand.id)
				// Fetch details including photos
				const detRes = await fetch(`/api/services/places?placeId=${cand.id}`)
				const det = await detRes.json()
				const ph: Photo[] = det?.result?.photos || []
				if (!active) return
				setPhotos(ph)
			} catch (e: any) {
				if (!active) return
				setError(e?.message || "Failed to load photos")
				setPhotos([])
			} finally {
				if (active) setLoading(false)
			}
		}
		run()
		return () => {
			active = false
		}
	}, [name, lat, lng, max])

	const placeLink = useMemo(() => (placeId ? `https://maps.google.com/?cid=${placeId}` : null), [placeId])

	if (!apiKey) {
		return (
			<div className="text-sm text-muted-foreground">
				To show Google photos, set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
			</div>
		)
	}

	return (
		<div className="space-y-2">
			{loading && <div className="text-sm text-muted-foreground">Loading photos…</div>}
			{error && <div className="text-sm text-amber-600">{error}</div>}
			{photos && photos.length > 0 ? (
				<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
					{photos.slice(0, limit).map((p) => (
						<a key={p.ref} href={photoUrl(p.ref, p.width)} target="_blank" rel="noreferrer" className="block">
							<img
								src={photoUrl(p.ref, p.width)}
								alt={name}
								className="w-full h-32 md:h-40 object-cover rounded"
								loading="lazy"
							/>
						</a>
					))}
				</div>
			) : (
				!loading && <div className="text-sm text-muted-foreground">No photos found.</div>
			)}
			{photos && photos.length > limit && (
				<div>
					<button className="text-sm underline text-primary" onClick={() => setLimit((n) => Math.min(60, n + 12))}>
						Show more
					</button>
				</div>
			)}
			{placeLink && (
				<div className="text-xs">
					<a href={placeLink} target="_blank" className="underline text-primary">
						View more on Google Maps
					</a>
				</div>
			)}
		</div>
	)
}

