import { NextRequest, NextResponse } from 'next/server'

// Proxy to Google Directions API to avoid exposing key directly on client for route fetch.
// Query params: origin=lat,lng&destination=lat,lng&modes=driving,walking,transit
// Returns shape { routes: { mode, distanceMeters, durationSeconds, polyline: { path: [ {lat,lng} ] } }[] }

export const dynamic = 'force-dynamic'

function parseLatLng(val: string | null): { lat: number; lng: number } | null {
  if (!val) return null
  const parts = val.split(',').map(v=> Number(v.trim()))
  if (parts.length !== 2 || parts.some(isNaN)) return null
  return { lat: parts[0], lng: parts[1] }
}

export async function GET(req: NextRequest){
  const { searchParams } = new URL(req.url)
  const originStr = searchParams.get('origin')
  const destinationStr = searchParams.get('destination')
  const modesParam = searchParams.get('modes') || 'driving,walking'
  const origin = parseLatLng(originStr)
  const destination = parseLatLng(destinationStr)
  if (!origin || !destination){
    return NextResponse.json({ error: 'Invalid origin/destination' }, { status: 400 })
  }
  const modes = modesParam.split(',').map(m=> m.trim()).filter(Boolean)
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey){
    return NextResponse.json({ error: 'Directions API not configured' }, { status: 503 })
  }

  const results: any[] = []

  for (const mode of modes){
    const travelMode = mode.toLowerCase()
    if (!['driving','walking','transit','bicycling'].includes(travelMode)) continue
    try {
      // Using Directions API REST
      const url = new URL('https://maps.googleapis.com/maps/api/directions/json')
      url.searchParams.set('origin', `${origin.lat},${origin.lng}`)
      url.searchParams.set('destination', `${destination.lat},${destination.lng}`)
      url.searchParams.set('mode', travelMode)
      url.searchParams.set('key', apiKey)
      const resp = await fetch(url.toString(), { next: { revalidate: 0 } })
      if (!resp.ok) throw new Error('fetch failed')
      const data = await resp.json()
      const leg = data?.routes?.[0]?.legs?.[0]
      const overview = data?.routes?.[0]?.overview_polyline?.points
      if (leg){
        let decoded: { lat: number; lng: number }[] = []
        if (overview){
          decoded = decodePolyline(overview)
        }
        results.push({
          mode: travelMode,
            distanceMeters: leg.distance?.value,
            durationSeconds: leg.duration?.value,
            polyline: { path: decoded }
        })
      }
    } catch (e){
      // continue other modes
    }
  }

  return NextResponse.json({ routes: results })
}

// Polyline decoder (Google Encoded Polyline Algorithm Format)
function decodePolyline(str: string){
  let index = 0, lat = 0, lng = 0; const coordinates: { lat: number; lng: number }[] = []
  while (index < str.length){
    let b, shift = 0, result = 0
    do { b = str.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5 } while (b >= 0x20)
    const dlat = (result & 1) ? ~(result >> 1) : (result >> 1); lat += dlat
    shift = 0; result = 0
    do { b = str.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5 } while (b >= 0x20)
    const dlng = (result & 1) ? ~(result >> 1) : (result >> 1); lng += dlng
    coordinates.push({ lat: lat / 1e5, lng: lng / 1e5 })
  }
  return coordinates
}
