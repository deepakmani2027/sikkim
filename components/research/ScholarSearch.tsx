"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExternalLink, Search, Clock, Filter, FileText, BookOpen, Link as LinkIcon } from "lucide-react"

type ScholarItem = {
  title?: string
  link?: string
  snippet?: string
  publication_info?: any
  authors?: Array<{ name?: string; link?: string }>
  year?: number
  cited_by?: number
  cited_by_link?: string
  pdf?: string
}

export function ScholarSearch() {
  const [q, setQ] = useState("")
  const [asYlo, setAsYlo] = useState<number | undefined>(undefined)
  const [asYhi, setAsYhi] = useState<number | undefined>(undefined)
  const [scisbd, setScisbd] = useState<"0" | "1" | "2">("0")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<ScholarItem[]>([])
  const [rawMode, setRawMode] = useState(false)
  const [lastQuery, setLastQuery] = useState<string>("")
  const abortRef = useRef<AbortController | null>(null)

  const yearOptions = useMemo(() => {
    const y: number[] = []
    const current = new Date().getFullYear()
    for (let i = current; i >= 1980; i--) y.push(i)
    return y
  }, [])

  const runSearch = useCallback(async () => {
    if (!q?.trim()) return
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setLoading(true)
    setError(null)
    setLastQuery(q)
    try {
      const params = new URLSearchParams()
      params.set("q", q)
      if (asYlo) params.set("as_ylo", String(asYlo))
      if (asYhi) params.set("as_yhi", String(asYhi))
      if (scisbd) params.set("scisbd", scisbd)
      const resp = await fetch(`/api/scholar?${params.toString()}`, { signal: controller.signal, cache: "no-store" })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data?.error || `Query failed: ${resp.status}`)
      setResults(Array.isArray(data?.normalized) ? data.normalized : [])
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        setError(e?.message || "Search failed")
      }
    } finally {
      setLoading(false)
    }
  }, [q, asYlo, asYhi, scisbd])

  // Handy presets for researchers
  const presets = [
    "author:Padmasambhava pilgrimage rituals",
    "monastery architecture symbolism",
    "source:Journal comparative buddhist studies",
    "buddhist cham dance iconography",
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" /> Google Scholar Search
        </CardTitle>
        <CardDescription>Query articles, filter by year range, and view citations or PDFs.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Query and actions */}
        <div className="flex flex-col lg:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="e.g., Nyingma monastery history author:Samuel"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={runSearch} disabled={loading || !q.trim()} className="min-w-28">
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <Badge key={p} variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => setQ(p)}>
              {p}
            </Badge>
          ))}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Year from</div>
            <Select value={asYlo ? String(asYlo) : undefined} onValueChange={(v) => setAsYlo(v === "any" ? undefined : Number(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {yearOptions.map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Year to</div>
            <Select value={asYhi ? String(asYhi) : undefined} onValueChange={(v) => setAsYhi(v === "any" ? undefined : Number(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {yearOptions.map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Sort / Recent additions</div>
            <Select value={scisbd} onValueChange={(v) => setScisbd(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Relevance</SelectItem>
                <SelectItem value="1">Added last year (abstracts)</SelectItem>
                <SelectItem value="2">Added last year (all)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <div className="text-sm text-amber-600">{error}</div>
        )}

        {/* Results */}
        <div className="space-y-3">
          {results.length === 0 && !loading && lastQuery && (
            <div className="text-sm text-muted-foreground">No results found for "{lastQuery}".</div>
          )}
          {results.map((r, idx) => (
            <div key={idx} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <a href={r.link} target="_blank" className="text-base font-semibold hover:underline">
                    {r.title || "Untitled"}
                  </a>
                  <div className="text-xs text-muted-foreground mt-1">
                    {r.authors?.map((a) => a.name).filter(Boolean).join(", ")}
                    {r.year ? ` • ${r.year}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap">
                  {typeof r.cited_by === "number" && (
                    <a href={r.cited_by_link || undefined} target="_blank" className="text-xs underline">
                      Cited by {r.cited_by}
                    </a>
                  )}
                  {r.pdf && (
                    <a href={r.pdf} target="_blank" className="text-xs inline-flex items-center gap-1 underline">
                      <FileText className="h-3 w-3" /> PDF
                    </a>
                  )}
                </div>
              </div>
              {r.snippet && <div className="text-sm text-muted-foreground mt-2">{r.snippet}</div>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


