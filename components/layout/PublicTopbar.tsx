"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useAuth } from "@/hooks/use-auth"
import { ArrowRight, Map, Camera, BookOpen, LogIn } from "lucide-react"
import { useEffect, useState } from "react"

export function PublicTopbar() {
  const { isAuthenticated } = useAuth()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const sTop = window.scrollY
      const docH = document.documentElement.scrollHeight - window.innerHeight
      const pct = docH > 0 ? Math.min(100, Math.max(0, (sTop / docH) * 100)) : 0
      setProgress(pct)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30">
        <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground transition-transform hover:rotate-3 hover:scale-105">🏔️</span>
          <span className="font-semibold">Sikkim Monasteries</span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="bg-transparent hover:translate-y-[-1px] transition-transform">
            <Link href="#explore" className="inline-flex items-center gap-1"><Map className="h-4 w-4" /> Explore</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="bg-transparent hover:translate-y-[-1px] transition-transform">
            <Link href="/virtual-tours" className="inline-flex items-center gap-1"><Camera className="h-4 w-4" /> Virtual Tours</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="bg-transparent hover:translate-y-[-1px] transition-transform">
            <Link href="#archives" className="inline-flex items-center gap-1"><BookOpen className="h-4 w-4" /> Archives</Link>
          </Button>
          <ThemeToggle />
          {!isAuthenticated ? (
            <Button asChild size="sm" className="ml-1 hover:shadow-md transition-transform hover:translate-y-[-1px]">
              <Link href="/auth" className="inline-flex items-center gap-1"><LogIn className="h-4 w-4" /> Sign in</Link>
            </Button>
          ) : (
            <Button asChild size="sm" variant="secondary" className="ml-1 hover:shadow-md transition-transform hover:translate-y-[-1px]">
              <Link href="/dashboard" className="inline-flex items-center gap-1">Open app <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}


