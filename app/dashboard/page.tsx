"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Navbar } from "@/components/layout/navbar"
import { TouristDashboard } from "@/components/dashboard/tourist-dashboard"
import { ResearcherDashboard } from "@/components/dashboard/researcher-dashboard"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null // Will redirect
  }

  const renderDashboard = () => {
    switch (user.role) {
      case "tourist":
        return <TouristDashboard />
      case "researcher":
        return <ResearcherDashboard />
      case "admin":
        return <AdminDashboard />
      default:
        return <TouristDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{renderDashboard()}</main>
    </div>
  )
}
