"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Download, Share2, FileText, ImageIcon, Book, ScrollText } from "lucide-react"
import { toast } from "sonner"

type ArchiveItem = {
  id: string
  title: string
  type: "Manuscript" | "Mural" | "Photo" | "Document"
  century: string
  monastery: string
  language: string
  material: string
  status: "Excellent" | "Good" | "Fair"
  image: string
  description: string
  dimensions?: string
  dateAcquired?: string
}

const ARCHIVE_ITEMS: ArchiveItem[] = [
  {
    id: "lotus-sutra",
    title: "Lotus Sutra Manuscript",
    type: "Manuscript",
    century: "17th Century",
    monastery: "Rumtek Monastery",
    language: "Classical Tibetan",
    material: "Handmade paper, gold ink",
    status: "Excellent",
    image: "/main-image.jpeg",
    description:
      "Ancient Tibetan manuscript of the Lotus Sutra written on handmade paper with gold ink illuminations, representing one of the most important Buddhist texts.",
    dimensions: "42 × 8 cm (folio)",
    dateAcquired: "1898-04-12",
  },
  {
    id: "buddha-life-mural",
    title: "Buddha Life Murals",
    type: "Mural",
    century: "18th Century",
    monastery: "Pemayangtse Monastery",
    language: "Visual Art",
    material: "Natural pigments on wall",
    status: "Good",
    image: "/unnamed.jpg",
    description:
      "Intricate wall paintings depicting the life of Buddha from birth to enlightenment, showcasing traditional Tibetan artistic techniques.",
    dimensions: "300 × 150 cm",
    dateAcquired: "2001-07-22",
  },
  {
    id: "sacred-thangka-ralang",
    title: "Sacred Thangka Painting",
    type: "Photo",
    century: "18th Century",
    monastery: "Ralang Monastery",
    language: "Visual Art (Symbolic Buddhist Iconography)",
    material: "Cotton canvas, natural mineral pigments, gold leaf",
    status: "Good",
    image: "/xyz.jpg",
    description:
      "Elaborate hand-painted Thangka depicting Buddhist deities and cosmic mandalas, traditionally used for meditation and spiritual teaching. Preserved as a cultural treasure of Ralang Monastery.",
  },
  {
    id: "ritual-prayer",
    title: "Ritual Prayer Instructions",
    type: "Document",
    century: "19th Century",
    monastery: "Enchey Monastery",
    language: "Tibetan, Nepali",
    material: "Handmade paper",
    status: "Good",
    image: "/enchey-2.jpg",
    description:
      "Detailed instructions for conducting daily prayers and seasonal festivals, including proper pronunciations and ritual procedures.",
  },
  {
    id: "sacred-mandala",
    title: "Sacred Mandala Thangka",
    type: "Photo",
    century: "17th Century",
    monastery: "Dubdi Monastery",
    language: "Visual Art",
    material: "Silk, natural pigments",
    status: "Excellent",
    image: "/mandala_thangka_1_Thangka_Store_1024x1024.webp",
    description:
      "Sacred thangka painting depicting an intricate Buddhist mandala with geometric patterns representing the universe and spiritual path.",
  },
  {
    id: "chanting-manuscript",
    title: "Chanting Manuscript",
    type: "Manuscript",
    century: "18th Century",
    monastery: "Rumtek Monastery",
    language: "Sanskrit, Tibetan",
    material: "Palm leaf, iron ink",
    status: "Good",
    image: "/pqr.jpg",
    description:
      "Musical notation and lyrics for traditional Buddhist chants and prayers, preserving ancient vocal traditions.",
  },
]

const typeIcon = (t: ArchiveItem["type"]) => {
  switch (t) {
    case "Manuscript":
      return <Book className="h-3.5 w-3.5" />
    case "Mural":
      return <ImageIcon className="h-3.5 w-3.5" />
    case "Photo":
      return <ImageIcon className="h-3.5 w-3.5" />
    case "Document":
      return <FileText className="h-3.5 w-3.5" />
  }
}

function statusClass(status: ArchiveItem["status"]) {
  if (status === "Excellent") return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
  if (status === "Good") return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
  return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
}

export default function DigitalArchivesPage() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<ArchiveItem | null>(null)

  const items = useMemo(() => ARCHIVE_ITEMS, [])

  function onPreview(item: ArchiveItem) {
    setActive(item)
    setOpen(true)
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

  async function downloadArchiveAsPDF(item: ArchiveItem) {
    const { jsPDF } = await import("jspdf")
    const doc = new jsPDF({ orientation: "p", unit: "pt", format: "a4" })

    const margin = 40
    let y = margin
    const pageWidth = doc.internal.pageSize.getWidth()
    const contentWidth = pageWidth - margin * 2

    // Branded header with logo + site title
    try {
      const logoData = await imageToDataUrl("/placeholder-logo.png")
      const logoW = 36
      const logoH = 36
      doc.addImage(logoData, "PNG", margin, y - 6, logoW, logoH)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(16)
      doc.text("Sikkim Monasteries", margin + logoW + 10, y + 10)
      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      doc.text("Sacred Heritage Explorer", margin + logoW + 10, y + 26)
      y += 44
      // separation line
      doc.setDrawColor(200)
      doc.line(margin, y, pageWidth - margin, y)
      y += 26
    } catch {}

  doc.setFont("helvetica", "bold")
  doc.setFontSize(20)
  doc.text(item.title, margin, y)
    y +=26

    doc.setFont("helvetica", "normal")
    doc.setFontSize(12)
    doc.text(`${item.monastery} • ${item.century}`, margin, y)
    y += 26

    try {
      const dataUrl = await imageToDataUrl(item.image)
      // Compute image dimensions keeping aspect ratio, max height ~ 260pt
      const img = document.createElement("img")
      const imgLoaded: Promise<void> = new Promise((resolve) => {
        img.onload = () => resolve()
      })
      img.src = dataUrl
      await imgLoaded
      const maxImgHeight = 260
      const ratio = img.width / img.height
      let drawW = contentWidth
      let drawH = Math.round(drawW / ratio)
      if (drawH > maxImgHeight) {
        drawH = maxImgHeight
        drawW = Math.round(drawH * ratio)
      }
      const x = margin + (contentWidth - drawW) / 2
      doc.addImage(dataUrl, "JPEG", x, y, drawW, drawH)
      y += drawH + 16
    } catch {
      // If image fails, continue with text only
    }

    // Description
    doc.setFontSize(12)
    const desc = doc.splitTextToSize(item.description, contentWidth)
    doc.text(desc, margin, y)
    y += 18 + 14 * (Array.isArray(desc) ? desc.length - 1 : 0)

    // Meta table (two columns) — compute dynamic label widths to ensure proper gap
    const rows: Array<[string, string]> = [
      ["Language", item.language || "—"],
      ["Material", item.material || "—"],
      ["Dimensions", item.dimensions || "—"],
      ["Date Acquired", item.dateAcquired || "—"],
      ["Conservation Status", item.status],
    ]

    const colW = contentWidth / 2
    const rowH = 22
    const valuePadding = 8
    doc.setFontSize(12)
    for (let i = 0; i < rows.length; i++) {
      const col = i % 2
      const row = Math.floor(i / 2)
      const rowY = y + row * rowH
      const colX = margin + col * colW

      const labelText = `${rows[i][0]}:`
      doc.setFont("helvetica", "bold")
      doc.text(labelText, colX, rowY)

      // Measure label width to position value with adequate spacing
      const labelWidth = doc.getTextWidth(labelText)
      const valueX = colX + labelWidth + valuePadding

      doc.setFont("helvetica", "normal")
      // If value might be long, ensure it doesn't overflow the column
      const availableValueWidth = colW - (labelWidth + valuePadding)
      const valueText = doc.splitTextToSize(rows[i][1], availableValueWidth)
      doc.text(valueText as any, valueX, rowY)
    }

    // Footer note
    const filename = `${item.title.replace(/\s+/g, "-").toLowerCase()}.pdf`
    doc.save(filename)
  }

  async function onShare(item: ArchiveItem) {
    const url = typeof window !== "undefined" ? window.location.origin + "/digital-archives#" + item.id : ""
    if (navigator.share) {
      try {
        await navigator.share({ title: item.title, text: item.description, url })
      } catch {}
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10">
        <header className="text-left sm:text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-primary">Digital Archives</h1>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-0 sm:mx-auto">
            Ancient manuscripts (pechas), thangkas, murals, and rare scriptures — scanned and preserved in high‑quality digital format.
          </p>
        </header>

        <section
          className="grid gap-6 md:gap-7 [grid-template-columns:repeat(auto-fit,minmax(460px,1fr))]"
          id="collection"
        >
          {items.map((it) => (
            <Card key={it.id} className="overflow-hidden border border-border/60 p-0">
              <div className="relative h-60 sm:h-72 md:h-80">
                <Image src={it.image} alt={it.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />

                {/* Type badge */}
                <div className="absolute left-2 top-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/60 text-white px-2 py-0.5 text-[11px] font-medium ring-1 ring-white/10 backdrop-blur">
                    {typeIcon(it.type)}
                    <span className="uppercase tracking-wide">{it.type}</span>
                  </span>
                </div>
                {/* Century badge */}
                <div className="absolute right-2 top-2">
                  <span className="inline-flex items-center rounded-full bg-amber-500 text-white px-2 py-0.5 text-[11px] font-semibold ring-1 ring-amber-600/70 shadow">
                    {it.century}
                  </span>
                </div>
              </div>

              <CardContent className=" pb-4">
                <h3 className="text-2xl sm:text-[28px] font-bold leading-tight">{it.title}</h3>
                <p className="mt-1 text-base text-muted-foreground">{it.monastery}</p>
                <p className="mt-3 text-base text-muted-foreground line-clamp-3">{it.description}</p>

                <div className="mt-4 space-y-1 text-sm">
                  <div className="flex items-center gap-2"><span className="font-semibold">Language:</span><span>{it.language}</span></div>
                  <div className="flex items-center gap-2"><span className="font-semibold">Material:</span><span>{it.material}</span></div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Status:</span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${statusClass(it.status)}`}>{it.status}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Button className="grow" onClick={() => onPreview(it)}>Preview</Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href={it.image} download>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Benefits strip */}
        <section className="rounded-3xl border border-border p-6 sm:p-8 bg-card">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-xl font-semibold">Prevention</h3>
              <p className="text-sm text-muted-foreground">Prevents loss due to decay, fire, theft, or natural disasters.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Global Access</h3>
              <p className="text-sm text-muted-foreground">Scholars and monks worldwide can access them for research.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Cultural Library</h3>
              <p className="text-sm text-muted-foreground">Creates a permanent cultural library for future generations.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Preview Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] sm:max-w-5xl md:max-w-6xl">
          {active && (
            <div>
              <DialogHeader>
                <DialogTitle className="text-2xl sm:text-3xl font-bold">{active.title}</DialogTitle>
                <DialogDescription className="text-base sm:text-lg text-muted-foreground">
                  {active.monastery} • {active.century}
                </DialogDescription>
              </DialogHeader>

              <div className="relative mt-4 h-80 sm:h-96 md:h-[30rem] rounded overflow-hidden">
                <Image src={active.image} alt={active.title} fill className="object-cover" />
              </div>

              <p className="mt-4 text-base sm:text-lg text-muted-foreground">{active.description}</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 text-base">
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="font-medium">Language:</span>
                  <span>{active.language}</span>
                </div>
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="font-medium">Material:</span>
                  <span>{active.material}</span>
                </div>
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="font-medium">Dimensions:</span>
                  <span>{active.dimensions || "—"}</span>
                </div>
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="font-medium">Date Acquired:</span>
                  <span>{active.dateAcquired || "—"}</span>
                </div>
                <div className="flex items-center justify-between border-t pt-3 sm:col-span-2">
                  <span className="font-medium">Conservation Status:</span>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-sm ${statusClass(active.status)}`}>{active.status}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button className="grow" onClick={() => downloadArchiveAsPDF(active)}>
                  <Download className="mr-2 h-4 w-4" /> Download High Resolution
                </Button>
                <Button variant="outline" onClick={() => onShare(active)} className="grow">
                  <Share2 className="mr-2 h-4 w-4" /> Share Archive
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
