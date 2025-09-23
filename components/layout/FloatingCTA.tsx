"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Camera, MapPin } from "lucide-react"
import { useEffect, useState } from "react"

export function FloatingCTA() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 600)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className={`fixed bottom-6 right-6 z-40 transition-all duration-700 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="flex gap-2">
        <Button asChild variant="secondary" className="shadow-lg hover:shadow-xl">
          <Link href="/virtual-tours" className="inline-flex items-center gap-1"><Camera className="h-4 w-4" /> Try a 360° Tour</Link>
        </Button>
        <Button asChild className="shadow-lg hover:shadow-xl">
          <Link href="/map" className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> Explore Map</Link>
        </Button>
      </div>
    </div>
  )
}


