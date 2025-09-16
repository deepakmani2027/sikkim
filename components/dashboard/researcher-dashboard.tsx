"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Download, BookOpen, Filter, Clock, Archive } from "lucide-react"
import { useState } from "react"

export function ResearcherDashboard() {
  const [searchQuery, setSearchQuery] = useState("")

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
            AI-Powered Archive Search
          </CardTitle>
          <CardDescription>Use natural language to search through manuscripts and artifacts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="e.g., 'Find manuscripts about meditation practices from the 16th century'"
                className="flex-1"
              />
              <Button>Search</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                Buddhist rituals
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                Architectural history
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                Ancient texts
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                Ceremonial artifacts
              </Badge>
            </div>
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
                  <Button size="sm" variant="outline">
                    Preview
                  </Button>
                  {!archive.restricted ? (
                    <Button size="sm">
                      <Download className="mr-1 h-4 w-4" />
                      Download
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary">
                      Request Access
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
