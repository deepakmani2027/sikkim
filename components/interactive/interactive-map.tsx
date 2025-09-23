"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Navigation, Search, Filter, Layers, ZoomIn, ZoomOut, Locate, Route } from "lucide-react"

interface MapLocation {
  id: string
  name: string
  coordinates: { lat: number; lng: number }
  type: "monastery" | "landmark" | "viewpoint"
  description: string
  rating: number
  image: string
}

export function InteractiveMap() {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [mapLayer, setMapLayer] = useState("satellite")
  const [showFilters, setShowFilters] = useState(false)

  const locations: MapLocation[] = [
    {
      id: "rumtek",
      name: "Rumtek Monastery",
      coordinates: { lat: 27.3389, lng: 88.5583 },
      type: "monastery",
      description: "The largest monastery in Sikkim",
      rating: 4.8,
      image: "/rumtek-monastery-sikkim-buddhist-temple.jpg",
    },
    {
      id: "pemayangtse",
      name: "Pemayangtse Monastery",
      coordinates: { lat: 27.2951, lng: 88.2158 },
      type: "monastery",
      description: "One of the oldest monasteries in Sikkim",
      rating: 4.7,
      image: "/pemayangtse-monastery-sikkim-mountain-view.jpg",
    },
    {
      id: "tashiding",
      name: "Tashiding Monastery",
      coordinates: { lat: 27.3333, lng: 88.2667 },
      type: "monastery",
      description: "Sacred monastery on a hilltop",
      rating: 4.6,
      image: "/tashiding-monastery-sikkim-sacred-site.jpg",
    },
    {
      id: "kanchenjunga",
      name: "Kanchenjunga Viewpoint",
      coordinates: { lat: 27.7025, lng: 88.1475 },
      type: "viewpoint",
      description: "Best view of the third highest peak",
      rating: 4.9,
      image: "/placeholder.svg?height=200&width=300&text=Kanchenjunga+View",
    },
  ]

  const getMarkerColor = (type: string) => {
    switch (type) {
      case "monastery":
        return "bg-primary"
      case "landmark":
        return "bg-secondary"
      case "viewpoint":
        return "bg-accent"
      default:
        return "bg-muted"
    }
  }

  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Map Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Interactive Map of Sikkim Monasteries
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Locate className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Controls & Search */}
        <div className="space-y-4">
          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Map Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Map Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Layers className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Map Layer</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={mapLayer === "satellite" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMapLayer("satellite")}
                  >
                    Satellite
                  </Button>
                  <Button
                    variant={mapLayer === "terrain" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMapLayer("terrain")}
                  >
                    Terrain
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Locations ({filteredLocations.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {filteredLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => setSelectedLocation(location)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedLocation?.id === location.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full ${getMarkerColor(location.type)} mt-1`}></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{location.name}</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {location.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{location.description}</p>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400 text-xs">⭐</span>
                        <span className="text-xs">{location.rating}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Map Area */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardContent className="p-0 h-full relative">
              {/* Simulated Map */}
              <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 rounded-lg relative overflow-hidden">
                {/* Map Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                  ></div>
                </div>

                {/* Location Markers */}
                {locations.map((location, index) => (
                  <div
                    key={location.id}
                    className={`absolute w-8 h-8 ${getMarkerColor(location.type)} rounded-full border-2 border-white cursor-pointer shadow-lg hover:scale-110 transition-transform flex items-center justify-center`}
                    style={{
                      left: `${20 + index * 15}%`,
                      top: `${30 + index * 10}%`,
                    }}
                    onClick={() => setSelectedLocation(location)}
                  >
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                ))}

                {/* Map Legend */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <h4 className="text-sm font-medium mb-2">Legend</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-xs">Monastery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-secondary rounded-full"></div>
                      <span className="text-xs">Landmark</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-accent rounded-full"></div>
                      <span className="text-xs">Viewpoint</span>
                    </div>
                  </div>
                </div>

                {/* Selected Location Info */}
                {selectedLocation && (
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                    <div className="flex items-start gap-4">
                      <img
                        src={selectedLocation.image || "/placeholder.svg"}
                        alt={selectedLocation.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{selectedLocation.name}</h4>
                          <Badge variant="outline" className="text-xs capitalize">
                            {selectedLocation.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{selectedLocation.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">⭐</span>
                            <span className="text-sm">{selectedLocation.rating}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Route className="h-4 w-4" />
                            </Button>
                            <Button size="sm">
                              <Navigation className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
