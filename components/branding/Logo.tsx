"use client"
import Link from "next/link"
import { cn } from "@/lib/utils"
import React from "react"

interface LogoProps {
  variant?: "mountain" | "temple"
  withText?: boolean
  withTagline?: boolean
  size?: number
  className?: string
  href?: string
}

// Simple emoji-based logo; can be swapped to image later without changing usages.
export function Logo({
  variant = "temple",
  withText = false,
  withTagline = false,
  size = 40,
  className,
  href = "/"
}: LogoProps) {
  const emoji = variant === "mountain" ? "🏔️" : "🏛️"
  const boxSize = `${size}px`
  const content = (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground font-medium transition-transform hover:rotate-3 hover:scale-105 shadow-sm",
        className
      )}
      style={{ width: boxSize, height: boxSize, fontSize: Math.round(size * 0.62) }}
    >
      {emoji}
    </span>
  )

  if (!withText) {
    return (
      <Link href={href} aria-label="Sikkim Monasteries Home" className="inline-flex items-center">
        {content}
      </Link>
    )
  }

  return (
    <Link href={href} aria-label="Sikkim Monasteries Home" className="flex items-center gap-3 group">
      {content}
      <div className="leading-tight">
        <div className="font-bold text-xl tracking-tight group-hover:opacity-95">Sikkim Monasteries</div>
        {withTagline && (
          <div className="text-xs sm:text-sm text-muted-foreground mt-0.5">Sacred Heritage Explorer</div>
        )}
      </div>
    </Link>
  )
}
