"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Navbar } from "@/components/layout/navbar"
import { AudioGuide } from "@/components/interactive/audio-guide"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMonasteryById } from "@/lib/monasteries"
import {
  MapPin,
  Clock,
  Star,
  Camera,
  Headphones,
  Calendar,
  Info,
  ArrowLeft,
  Share2,
  Heart,
  Download,
} from "lucide-react"
import Link from "next/link"

export default function MonasteryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()
  const [monastery, setMonastery] = useState(getMonasteryById(params.id as string))
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("overview")

  const goToAudioGuide = () => {
    setActiveTab("audio")
    // scroll after tab renders
    setTimeout(() => {
      const el = document.getElementById("audio-guide")
      el?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 50)
  }

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
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !monastery) {
    return null
  }

  // Sample audio guide chapters
  const audioChapters = [
    {
      id: "intro",
      title: "Introduction & History",
      duration: "3:45",
      description: "Learn about the monastery's founding and historical significance",
      content:
        params.id === "rumtek"
          ? `Rumtek Monastery, also known as the Dharma Chakra Centre, is one of the most famous and sacred monasteries of Sikkim. It is located about 23 kilometers from Gangtok, the capital of the state, on a hilltop that provides a panoramic view of the surrounding valleys and mountains. The monastery belongs to the Karma Kagyu sect of Tibetan Buddhism, one of the oldest and most respected schools of Buddhism. The original structure of Rumtek was built in the mid-1700s by the 9th Karmapa, Wangchuk Dorje. The Karmapa is the head of the Karma Kagyu lineage, just like the Dalai Lama is the head of the Gelug school. At that time, Rumtek was established to spread Buddhist teachings and serve as a center of learning, prayer, and meditation. However, with the passage of time, the monastery fell into a state of neglect and slowly lost its former glory.

The story of Rumtek took a new turn in the 20th century, especially after the political changes in Tibet. In 1959, when Tibet was invaded and taken over by China, the 16th Karmapa, Rangjung Rigpe Dorje, fled Tibet along with many followers. He came to Sikkim and chose Rumtek as his new seat, as Sikkim had always shared close cultural and spiritual links with Tibet. With the support of the Sikkimese royal family and local people, the Karmapa rebuilt Rumtek Monastery in the 1960s. The new structure was modeled after the original Kagyu headquarters in Tsurphu, Tibet, and became the international center for the Karma Kagyu lineage. This made Rumtek not only a spiritual refuge but also a symbol of the resilience of Tibetan Buddhism in exile.

Inside the monastery, one can find rare Buddhist manuscripts, scriptures, thankas or religious paintings, and many holy relics that were brought from Tibet. The monastery is also famous for its grand prayer halls, golden stupa, and intricate murals that display the depth of Buddhist art and philosophy. Apart from being a place of worship, Rumtek serves as a training ground for young monks who learn Buddhist philosophy, ritual practices, meditation, and traditional arts. It also becomes lively during festivals like Losar, the Tibetan New Year, and other religious ceremonies when monks perform sacred dances and rituals, attracting both devotees and visitors from around the world.

In this way, Rumtek Monastery is not just an architectural wonder, but also a living example of Sikkim’s cultural and religious heritage. Its history tells us about the journey of the Karma Kagyu lineage, the hardships faced during exile, and the successful preservation of tradition in a new land. Today, Rumtek continues to be a beacon of Buddhist teachings, a place of peace, and a bridge connecting Tibet, Sikkim, and the wider Buddhist world.`
          : undefined,
    },
    {
      id: "architecture",
      title: "Architecture & Design",
      duration: "4:20",
      description: "Explore the unique architectural features and Buddhist symbolism",
      content:
        params.id === "rumtek"
          ? `Rumtek Monastery is not only famous for its spiritual importance but also admired for its unique architecture and artistic design. The monastery is a beautiful example of traditional Tibetan Buddhist style, blended with some local Sikkimese influences. When you enter the monastery complex, the first thing that captures attention is its grand entrance gate, which is richly decorated with bright colors and symbolic motifs. The entire structure of Rumtek follows the traditional Tibetan pattern, with spacious courtyards, multi-storied buildings, prayer halls, and residential quarters for monks. The main monastery building has a massive golden roof that glitters under the sunlight and can be seen from a great distance, symbolizing purity and enlightenment.

The central attraction of Rumtek is the main prayer hall, which is three stories high. Its walls are decorated with beautiful murals and frescoes that depict various scenes from Buddhist mythology, the life of Lord Buddha, and the teachings of different lamas. The hall also houses a magnificent golden stupa containing the sacred relics of the 16th Karmapa. The pillars and ceilings are adorned with vibrant colors like red, blue, green, and gold, each having symbolic meaning in Buddhist tradition. Along the walls, there are thangkas, or scroll paintings, and intricate silk hangings that add to the sacred atmosphere. Large statues of Lord Buddha, Guru Padmasambhava, and other important deities are placed within the hall, reminding visitors of the deep spiritual energy of the place.

Another striking feature of the design is the monks’ quarters and institutes built around the main monastery. The complex also has a shedra, or monastic college, where monks receive training in philosophy, logic, meditation, and rituals. The entire layout of Rumtek is planned in a way that reflects harmony and balance, which are central to Buddhist thought. In the outer courtyard, one can often see monks chanting, practicing debate, or performing sacred dances during festivals. Colorful prayer flags flutter across the complex, carrying prayers to the winds, while the giant prayer wheels along the walls allow devotees to spin them as they walk, believing it spreads blessings.

Rumtek also reflects Tibetan craftsmanship in its wood carvings and decorative motifs. Intricate dragons, lotus flowers, and other sacred symbols are carved into the doors, windows, and beams, making the monastery not just a place of worship but also a gallery of traditional art. The monastery is surrounded by lush green hills, and its elevated position adds to its grandeur, making it look like a jewel resting on a hilltop. The whole design gives a sense of peace, symmetry, and sacredness, which perfectly matches the purpose of a Buddhist monastery.

In summary, the architecture and design of Rumtek Monastery combine functionality, symbolism, and beauty. It is built to serve as a spiritual center, a home for monks, and a treasure house of Buddhist art. Every corner of the monastery — from its golden roof to its sacred prayer hall and its colorful decorations — reflects the values of compassion, wisdom, and harmony. This makes Rumtek not only a significant religious site but also an architectural masterpiece that continues to inspire visitors and devotees from across the world.`
          : undefined,
    },
    {
      id: "rituals",
      title: "Daily Rituals & Practices",
      duration: "5:15",
      description: "Discover the daily life and spiritual practices of the monks",
      content:
        params.id === "rumtek"
          ? `Life at Rumtek Monastery is guided by discipline, devotion, and daily spiritual practice. The monks who live here follow a well-structured routine that is centered around prayer, meditation, and learning. Their day usually begins very early in the morning, often before sunrise. The first activity of the day is the morning prayer, where monks gather in the main prayer hall, chanting sacred mantras and reciting scriptures. These chants, accompanied by the sound of traditional instruments like drums, horns, and cymbals, create a deeply peaceful and spiritual atmosphere. The purpose of these prayers is to dedicate the day to the service of the Buddha’s teachings and to spread compassion and peace to all living beings.

After the morning prayers, monks engage in meditation practices. Meditation is considered essential in Buddhist life as it helps in calming the mind, developing wisdom, and understanding the nature of reality. Some monks may also perform personal rituals, lighting butter lamps or turning prayer wheels, which are believed to send blessings across the world. Throughout the day, the monastery also remains open to visitors and devotees, who join in prayers, spin the prayer wheels, or make offerings.

Another important part of daily life at Rumtek is scriptural study and training. Young monks spend several hours a day in classrooms or with senior teachers, learning Buddhist philosophy, scriptures, rituals, and the Tibetan language. They also practice debate, which is a traditional method of sharpening reasoning and understanding of Buddhist thought. Apart from spiritual learning, monks are also trained in arts like painting thangkas, making mandalas, and playing ritual instruments, which are all part of Buddhist culture.

Meals are taken together in simplicity, usually consisting of rice, vegetables, butter tea, or soup. Before eating, the monks chant prayers of gratitude and offer food symbolically to the Buddha and all sentient beings. In the afternoon, there may be more prayers, teachings, or meditation sessions. The evening again includes chanting and pujas, which are devotional ceremonies performed for peace, healing, and spiritual blessings. These pujas often involve the recitation of sacred texts and the offering of incense, butter lamps, and flowers.

Festivals and special occasions bring additional rituals. For example, during Losar, the Tibetan New Year, or the Kagyu Monlam Chenmo, the Great Prayer Festival, the monastery becomes vibrant with large-scale prayers, sacred dances called cham, and colorful rituals performed to purify negativity and bring prosperity. But even on regular days, the discipline of daily prayer, meditation, study, and service keeps the monastery alive with spiritual energy.

In this way, the daily rituals and practices at Rumtek Monastery are not just religious duties but a way of life. They are designed to bring inner peace, cultivate compassion, preserve Buddhist traditions, and keep the teachings of the Karmapa lineage alive for future generations. For visitors, watching these practices is a reminder of the deep spiritual culture that has been maintained at Rumtek for centuries.`
          : undefined,
    },
    {
      id: "artifacts",
      title: "Sacred Artifacts & Art",
      duration: "3:30",
      description: "Examine the precious artifacts and religious artwork",
      content:
        params.id === "rumtek"
          ? `Rumtek Monastery is not only a spiritual and cultural center but also a treasure house of sacred artifacts and Buddhist art. Within its walls, one can find many holy objects that carry deep religious significance and connect the monastery to centuries of Buddhist tradition. One of the most important relics preserved here is the golden stupa of the 16th Karmapa, which is richly decorated with precious stones. This stupa holds the remains of the revered leader and is considered the heart of the monastery. Devotees from across the world come to pay their respects at this sacred monument, believing that it radiates blessings and spiritual power.

Apart from the stupa, Rumtek houses an invaluable collection of ancient manuscripts, scriptures, and texts brought from Tibet when the 16th Karmapa came into exile. These texts preserve the teachings of the Karma Kagyu lineage and are carefully stored and studied by the monks. Many of them are hand-written in golden ink on black paper, reflecting the artistry and devotion of Buddhist scholars. The monastery also safeguards rare religious objects such as ritual instruments, vajras, bells, conch shells, and butter lamps, all of which are used in daily pujas and special ceremonies.

Art plays an equally important role in Rumtek’s identity. The walls of the main prayer hall are decorated with intricate murals and frescoes that depict Buddhist deities, protective guardians, mandalas, and scenes from the life of the Buddha. These artworks are not simply decorative but serve as teaching tools and visual guides for meditation. Each image is rich in symbolism — for example, the lotus represents purity, the wheel symbolizes the Dharma or teachings of the Buddha, and the dragon represents power and protection. The monastery also has a remarkable collection of thangkas, which are scroll paintings made on silk or cotton. These thangkas are hung during festivals and rituals, and some of them are very large and centuries old.

Another artistic feature of Rumtek is its woodwork and carvings. The monastery’s doors, windows, and beams are decorated with hand-carved designs of flowers, mythical creatures, and sacred symbols, all painted in vibrant colors like red, gold, and turquoise. The prayer wheels around the monastery, inscribed with the mantra Om Mani Padme Hum, are themselves considered sacred objects. By spinning them, devotees believe they are sending countless prayers into the universe.

In short, Rumtek Monastery is like a living museum of Buddhist art and sacred heritage. Every statue, painting, and relic inside it carries a spiritual message and reflects centuries of devotion. For monks, these artifacts are tools of learning and worship, while for visitors, they provide a glimpse into the depth of Tibetan Buddhist culture. Together, the sacred artifacts and art of Rumtek preserve the wisdom of the past and continue to inspire people with beauty, meaning, and faith.`
          : undefined,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Explore
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsFavorite(!isFavorite)}>
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden">
              <img
                src={monastery.images[selectedImage] || "/placeholder.svg"}
                alt={monastery.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {monastery.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-video rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${monastery.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{monastery.category}</Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{monastery.rating}</span>
                  <span className="text-muted-foreground">({monastery.reviews} reviews)</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{monastery.name}</h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="mr-2 h-4 w-4" />
                {monastery.location}, {monastery.district}
              </div>
              <p className="text-muted-foreground leading-relaxed">{monastery.description}</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              {monastery.virtualTour?.available && (
                <Button asChild className="h-12">
                  <Link href={`/monastery/${monastery.id}/tour`}>
                    <Camera className="mr-2 h-4 w-4" />
                    Virtual Tour
                  </Link>
                </Button>
              )}
              {monastery.audioGuide?.available && (
                <Button variant="outline" className="h-12 bg-transparent" onClick={goToAudioGuide}>
                  <Headphones className="mr-2 h-4 w-4" />
                  Audio Guide
                </Button>
              )}
              <Button asChild variant="outline" className="h-12 bg-transparent">
                <Link href={`/monter/${monastery.id}/direction`}>
                  <MapPin className="mr-2 h-4 w-4" />
                  Get Directions
                </Link>
              </Button>
              <Button variant="outline" className="h-12 bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Download Info
              </Button>
            </div>

            {/* Key Features */}
            <div className="flex flex-wrap gap-2">
              {monastery.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Information */}
  <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="visiting">Visiting Info</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="festivals">Festivals</TabsTrigger>
            <TabsTrigger value="audio">Audio Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    About This Monastery
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Founded</h4>
                    <p className="text-muted-foreground">{monastery.founded}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Architecture</h4>
                    <p className="text-muted-foreground">{monastery.architecture}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Significance</h4>
                    <p className="text-muted-foreground">{monastery.significance}</p>
                  </div>
                </CardContent>
              </Card>

              {monastery.audioGuide?.available && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Headphones className="h-5 w-5" />
                      Audio Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Duration</h4>
                      <p className="text-muted-foreground">{monastery.audioGuide.duration}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Available Languages</h4>
                      <div className="flex flex-wrap gap-1">
                        {monastery.audioGuide.languages.map((lang) => (
                          <Badge key={lang} variant="outline">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full" onClick={goToAudioGuide}>
                      <Headphones className="mr-2 h-4 w-4" />
                      Start Audio Guide
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="visiting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Visiting Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Opening Hours</h4>
                    <p className="text-muted-foreground">{monastery.visitingInfo.openingHours}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Entry Fee</h4>
                    <p className="text-muted-foreground">{monastery.visitingInfo.entryFee}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Best Time to Visit</h4>
                    <p className="text-muted-foreground">{monastery.visitingInfo.bestTimeToVisit}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Accessibility</h4>
                    <p className="text-muted-foreground">{monastery.visitingInfo.accessibility}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historical Background</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{monastery.history}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="festivals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {monastery.festivals.map((festival, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {festival.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        <strong>When:</strong> {festival.date}
                      </div>
                      <p className="text-muted-foreground">{festival.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="audio" className="space-y-6" id="audio-guide">
            {monastery.audioGuide?.available ? (
              <AudioGuide
                monasteryName={monastery.name}
                languages={monastery.audioGuide.languages}
                duration={monastery.audioGuide.duration}
                chapters={audioChapters}
              />
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Headphones className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Audio Guide Not Available</h3>
                  <p className="text-muted-foreground">Audio guide for this monastery is currently being prepared.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
