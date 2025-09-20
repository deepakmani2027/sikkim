"use client"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { monasteries } from "@/lib/monasteries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, IndianRupee, Star } from "lucide-react"
import { toast } from "sonner"

export default function ToursListPage(){
  const sp = useSearchParams()
  const monasteryId = sp.get('monasteryId') || monasteries[0]?.id
  const m = useMemo(()=> monasteries.find(x=>x.id===monasteryId), [monasteryId])
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{
    async function load(){
      if (!m) return
      const r = await fetch(`/api/services/nearby?near=${m.coordinates.lat},${m.coordinates.lng}&radiusKm=5`)
      const j = await r.json()
      if (r.ok) setItems((j.tours || []).filter((it:any)=> Number(it?.distanceKm||0) <= 5))
    }
    load()
  },[m])
  return (
    <main className="container mx-auto px-4 py-8 space-y-4">
      <h1 className="text-2xl font-bold">Tours & Activities near {m?.name}</h1>
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
              <div className="text-sm text-muted-foreground inline-flex items-center gap-2">
                <MapPin className="h-4 w-4"/>
                {typeof x.distanceKm === 'number' ? `${Number(x.distanceKm||0).toFixed(2)} km` : `Near ${m?.name}`}
              </div>
              <div className="font-semibold inline-flex items-center gap-1">
                <IndianRupee className="h-4 w-4"/>{new Intl.NumberFormat('en-IN').format(Math.round(Number(x.priceINR||0)))}
                <span className="text-xs text-muted-foreground pl-1">/person</span>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={async()=>{
                const r = await fetch('/api/services/requests', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ type:'tour', item: x, monasteryId }) })
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
