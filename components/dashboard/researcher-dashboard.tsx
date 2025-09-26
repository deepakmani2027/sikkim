"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Search, FileText, Download, BookOpen, Filter, Clock, Archive } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import Image from "next/image"
import { ScholarSearch } from "@/components/research/ScholarSearch"

export function ResearcherDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [previewOpen, setPreviewOpen] = useState(false)
  const [active, setActive] = useState<(typeof recentArchives)[number] | null>(null)

  const recentArchives = [
    {
      id: 1,
      title: "Ancient Manuscripts of Rumtek Monastery",
      type: "Manuscript",
      period: "15th Century",
      monastery: "Rumtek",
      size: "2.3 MB",
      downloads: 45,
      restricted: false,
      image: "/rumtek-monastery-sikkim-buddhist-temple.jpg",
    },
    {
      id: 2,
      title: "Architectural Drawings - Pemayangtse",
      type: "Blueprint",
      period: "18th Century",
      monastery: "Pemayangtse",
      size: "5.7 MB",
      downloads: 23,
      restricted: true,
      image: "/pemayangtse-monastery-sikkim-mountain-view.jpg",
    },
    {
      id: 3,
      title: "Ritual Artifacts Documentation",
      type: "Catalog",
      period: "19th Century",
      monastery: "Tashiding",
      size: "1.8 MB",
      downloads: 67,
      restricted: false,
      image: "/tashiding-monastery-bumchu-ceremony.jpg",
    },
  ]

  const researchStats = [
    { label: "Total Archives", value: "1,247", icon: Archive },
    { label: "Manuscripts", value: "342", icon: FileText },
    { label: "Your Downloads", value: "28", icon: Download },
    { label: "Pending Requests", value: "3", icon: Clock },
  ]

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "manuscript":
        return "bg-primary/10 text-primary"
      case "blueprint":
        return "bg-secondary/10 text-secondary"
      case "catalog":
        return "bg-accent/10 text-accent"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  function onPreview(archive: (typeof recentArchives)[number]) {
    setActive(archive)
    setPreviewOpen(true)
  }

  async function imageToDataUrl(src: string): Promise<string> {
    const url = src.startsWith("http") ? src : `${window.location.origin}${src}`
    const res = await fetch(url)
    const blob = await res.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
  }

  async function downloadArchive(archive: (typeof recentArchives)[number]) {
    // Lightweight branded PDF export (title + metadata)
    try {
      const { jsPDF } = await import("jspdf")
      const doc = new jsPDF({ orientation: "p", unit: "pt", format: "a4" })
      const margin = 40
      let y = margin
      doc.setFont("helvetica", "bold")
      doc.setFontSize(18)
      doc.text(archive.title, margin, y)
      y += 24
      doc.setFont("helvetica", "normal")
      doc.setFontSize(12)
      const meta = [
        ["Type", archive.type],
        ["Period", archive.period],
        ["Monastery", `${archive.monastery} Monastery`],
        ["File Size", archive.size],
        ["Downloads", String(archive.downloads)],
      ]
      meta.forEach(([k, v]) => {
        doc.text(`${k}: ${v}`, margin, y)
        y += 18
      })

      // Add image preview if available
      if (archive.image) {
        try {
          const dataUrl = await imageToDataUrl(archive.image)
          const pageWidth = doc.internal.pageSize.getWidth()
          const contentWidth = pageWidth - margin * 2
          // Determine dimensions while keeping aspect ratio
          const tmp = document.createElement("img")
          const loaded: Promise<void> = new Promise((r) => (tmp.onload = () => r()))
          tmp.src = dataUrl
          await loaded
          const maxH = 260
          const ratio = tmp.width / tmp.height
          let w = contentWidth
          let h = Math.round(w / ratio)
          if (h > maxH) {
            h = maxH
            w = Math.round(h * ratio)
          }
          const x = margin + (contentWidth - w) / 2
          y += 8
          doc.addImage(dataUrl, "JPEG", x, y, w, h)
          y += h + 10
        } catch {
          // ignore image failure
        }
      }
      const filename = `${archive.title.replace(/\s+/g, "-").toLowerCase()}.pdf`
      doc.save(filename)
      toast.success("Download started")
    } catch (e: any) {
      toast.error(e?.message || "Failed to download")
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg p-6 monastery-pattern">
        <h2 className="text-2xl font-bold text-foreground mb-2">Research Archives</h2>
        <p className="text-muted-foreground mb-4">
          Access comprehensive digital archives of manuscripts, artifacts, and historical documents.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search archives, manuscripts, artifacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filter
          </Button>
        </div>
      </div>

      {/* Research Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {researchStats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                  <IconComponent className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* AI-Powered Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            AI-Powered Research Paper Search
          </CardTitle>
          <CardDescription>Use natural language to search through manuscripts and artifacts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ScholarSearch />
          </div>
        </CardContent>
      </Card>

      {/* Recent Archives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Recent Archives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentArchives.map((archive) => (
              <div
                key={archive.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground">{archive.title}</h4>
                    {archive.restricted && (
                      <Badge variant="destructive" className="text-xs">
                        Restricted
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Badge className={getTypeColor(archive.type)}>{archive.type}</Badge>
                    </span>
                    <span>{archive.period}</span>
                    <span>{archive.monastery} Monastery</span>
                    <span>{archive.size}</span>
                    <span>{archive.downloads} downloads</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onPreview(archive)}>
                    Preview
                  </Button>
                  {!archive.restricted ? (
                    <Button size="sm" onClick={() => downloadArchive(archive)}>
                      <Download className="mr-1 h-4 w-4" />
                      Download
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => toast.info("Request sent. You'll be notified on approval.")}>
                      Request Access
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          {active && (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle className="text-2xl font-extrabold">{active.title}</DialogTitle>
                <DialogDescription>
                  {active.period} • {active.monastery} Monastery
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={getTypeColor(active.type)}>{active.type}</Badge>
                {active.restricted && (
                  <Badge variant="destructive">Restricted</Badge>
                )}
              </div>

              {/* Image preview */}
              {active.image && (
                <div className="relative h-56 sm:h-72 md:h-80 rounded overflow-hidden">
                  <Image src={active.image} alt={active.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 60vw" />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Period</span>
                  <span className="font-medium">{active.period}</span>
                </div>
                <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Monastery</span>
                  <span className="font-medium">{active.monastery} Monastery</span>
                </div>
                <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-sm">
                  <span className="text-muted-foreground">File Size</span>
                  <span className="font-medium">{active.size}</span>
                </div>
                <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Downloads</span>
                  <span className="font-medium">{active.downloads}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {!active.restricted ? (
                  <Button onClick={() => downloadArchive(active)} className="flex-1">
                    <Download className="mr-2 h-4 w-4" /> Download
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => toast.info("Request sent. You'll be notified on approval.")}
                    className="flex-1"
                  >
                    Request Access
                  </Button>
                )}
                <Button variant="outline" onClick={() => setPreviewOpen(false)} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Citation Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Research Tools</CardTitle>
          <CardDescription>Tools to help with your research and citations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <FileText className="h-6 w-6 mb-2" />
              Citation Generator
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Download className="h-6 w-6 mb-2" />
              Bulk Download
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Archive className="h-6 w-6 mb-2" />
              My Collections
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
