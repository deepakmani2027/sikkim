"use client"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { monasteries } from "@/lib/monasteries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, IndianRupee, Star, ExternalLink } from "lucide-react"
import { toast } from "sonner"

export default function HotelsListPage(){
  const sp = useSearchParams()
  const monasteryId = sp.get('monasteryId') || monasteries[0]?.id
  const m = useMemo(()=> monasteries.find(x=>x.id===monasteryId), [monasteryId])
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{
    async function load(){
      if (!m) return
  const r = await fetch(`/api/services/nearby?near=${m.coordinates.lat},${m.coordinates.lng}&radiusKm=5`)
      const j = await r.json()
  if (r.ok) setItems((j.hotel || []).filter((it:any)=> Number(it?.distanceKm||0) <= 5))
    }
    load()
  },[m])
  return (
    <main className="container mx-auto px-4 py-8 space-y-4">
      <h1 className="text-2xl font-bold">Hotels & Accommodation near {m?.name}</h1>
      <div className="grid gap-4">
        {items.map((x)=> (
          <Card key={x.id} className="border-yellow-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{x.name}</span>
                <span className="inline-flex items-center gap-1 text-sm"><Star className="h-4 w-4 text-yellow-600"/>{x.rating}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-2">
              <div className="text-sm text-muted-foreground inline-flex items-center gap-2"><MapPin className="h-4 w-4"/> {Number(x.distanceKm||0).toFixed(2)} km</div>
              <div className="font-semibold inline-flex items-center gap-1"><IndianRupee className="h-4 w-4"/>{new Intl.NumberFormat('en-IN').format(Math.round(Number(x.priceINR||0)))}<span className="text-xs text-muted-foreground pl-1">/night</span></div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={async()=>{
                  const lat = x.location?.lat ?? x.location?.latitude
                  const lng = x.location?.lng ?? x.location?.longitude
                  if (x.placeId) {
                    const url = `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(x.placeId)}`
                    window.open(url, '_blank')
                    return
                  }
                  if (x.name) {
                    try {
                      const hint = (x.address || m?.name || 'Sikkim') as string
                      const query = [x.name as string, hint].filter(Boolean).join(' ').trim()
                      const fp = await fetch(`/api/services/places?find=${encodeURIComponent(query)}${(typeof lat==='number'&&typeof lng==='number')?`&near=${lat},${lng}&radius=${5000}`:''}&type=lodging`)
                      if (fp.ok) {
                        const jf = await fp.json()
                        const best = (jf.results||[])[0]
                        if (best?.id) { window.open(`https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(best.id)}`,'_blank'); return }
                      }
                      const ts = await fetch(`/api/services/places?text=${encodeURIComponent(query)}${(typeof lat==='number'&&typeof lng==='number')?`&near=${lat},${lng}&radius=${5000}`:''}&type=lodging`)
                      if (ts.ok) {
                        const j = await ts.json()
                        const match = (j.results||[])[0]
                        if (match?.id) { window.open(`https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(match.id)}`,'_blank'); return }
                      }
                    } catch {}
                    const q = (typeof lat==='number'&&typeof lng==='number') ? `${x.name} near ${lat},${lng}` : `${x.name} ${m?.name||''} Sikkim`
                    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`,'_blank')
                    return
                  }
                  if (typeof lat==='number' && typeof lng==='number') {
                    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,'_blank')
                    return
                  }
                  toast.error('Location not available')
                }}>
                  <MapPin className="h-4 w-4 mr-2"/> Map
                </Button>
                <Button onClick={async()=>{
                const r = await fetch('/api/services/requests', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ type:'hotel', item: x, monasteryId }) })
                const j = await r.json();
                if (r.ok) toast.success('Request recorded')
                else toast.error(j.error||'Failed')
                }}>Book</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
