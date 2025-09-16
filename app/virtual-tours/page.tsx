"use client"

import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { monasteries } from "@/lib/monasteries"

export default function VirtualToursIndexPage() {
  const tours = monasteries.map((m) => ({
    id: m.id,
    name: m.name,
    location: m.location,
    image: m.images?.[0] || "/placeholder.jpg",
    available: !!m.virtualTour?.available,
  }))

  const availableCount = tours.filter((t) => t.available).length

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Virtual Tours</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Immerse yourself in 360° panoramic views of Sikkim's sacred monasteries. Use your mouse or phone to look around,
            zoom in on details, and explore key spots. More tours are coming soon.
          </p>
          <div className="mt-3 text-xs text-muted-foreground">
            <span className="mr-3">Available now: <span className="font-medium">{availableCount}</span></span>
            <span>Coming soon: <span className="font-medium">{tours.length - availableCount}</span></span>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <Card key={tour.id} className="overflow-hidden pt-0">
              <div className="aspect-video w-full bg-muted  ">
                <img src={tour.image} alt={tour.name} className="w-full h-full object-cover" />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{tour.name}</CardTitle>
                  <Badge variant={tour.available ? "default" : "secondary"}>{tour.available ? "Available" : "Coming Soon"}</Badge>
                </div>
                <CardDescription>{tour.location}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-0">
                {tour.available ? (
                  <Button asChild size="sm">
                    <Link href={`/monastery/${tour.id}/tour`}>Open 360° Tour</Link>
                  </Button>
                ) : (
                  <Button size="sm" variant="secondary" disabled title="This tour is not yet available">
                    Coming Soon
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </section>
      </main>
    </div>
  )
}
