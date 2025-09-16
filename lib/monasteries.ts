export interface Monastery {
  id: string
  name: string
  location: string
  district: string
  coordinates: {
    lat: number
    lng: number
  }
  description: string
  history: string
  significance: string
  founded: string
  architecture: string
  images: string[]
  virtualTour?: {
    available: boolean
    url?: string
    scenes?: Array<{
      id: string
      title: string
      image: string
      videoUrl?: string
      haov?: number
      vaov?: number
      vOffset?: number
      hotspots?: Array<{
        pitch: number
        yaw: number
        type: string
        text: string
        sceneId?: string
      }>
    }>
  }
  audioGuide?: {
    available: boolean
    languages: string[]
    duration: string
  }
  visitingInfo: {
    openingHours: string
    entryFee: string
    bestTimeToVisit: string
    accessibility: string
  }
  festivals: Array<{
    name: string
    date: string
    description: string
    sources?: Array<{ label: string; url: string }>
  }>
  rating: number
  reviews: number
  category: string
  tags: string[]
}

export const monasteries: Monastery[] = [
  {
    id: "rumtek",
    name: "Rumtek Monastery",
    location: "Rumtek, Gangtok",
    district: "East Sikkim",
    coordinates: { lat: 27.3389, lng: 88.5583 },
    description: "The largest monastery in Sikkim and the main seat of the Karma Kagyu lineage outside Tibet.",
    history:
      "Built in the 1960s by the 16th Karmapa, Rangjung Rigpe Dorje, as the main seat of the Karma Kagyu lineage in exile.",
    significance: "Serves as the main monastery of one of the four major schools of Tibetan Buddhism.",
    founded: "1966",
    architecture: "Traditional Tibetan architecture with golden roof and intricate woodwork",
    images: [
      "/rumtek-monastery-sikkim-buddhist-temple.jpg",
      "/rumtek-monastery-interior-golden-buddha.jpg",
      "/rumtek-monastery-courtyard-prayer-flags.jpg",
    ],
    virtualTour: {
      available: true,
      scenes: [
        {
          id: "main-hall",
          title: "Main Prayer Hall",
          image: "/rumtek-monastery-main-hall-360-view.jpg",
          hotspots: [
            { pitch: -10, yaw: 0, type: "info", text: "Golden Buddha statue - 16th century craftsmanship" },
            { pitch: 5, yaw: 90, type: "info", text: "Traditional Tibetan murals depicting Buddhist teachings" },
            { pitch: 0, yaw: 170, type: "scene", text: "Go to Courtyard", sceneId: "courtyard" },
          ],
        },
        {
          id: "courtyard",
          title: "Main Courtyard",
          image: "/rumtek-monastery-courtyard-360-panoramic-view.jpg",
          hotspots: [
            { pitch: 0, yaw: 180, type: "info", text: "Prayer wheels - spin clockwise for blessings" },
            { pitch: 0, yaw: -10, type: "scene", text: "Enter Main Hall", sceneId: "main-hall" },
          ],
        },
      ],
    },
    audioGuide: {
      available: true,
      languages: ["English", "Hindi", "Nepali", "Tibetan"],
      duration: "45 minutes",
    },
    visitingInfo: {
      openingHours: "6:00 AM - 6:00 PM",
      entryFee: "Free (Photography fee: ₹20)",
      bestTimeToVisit: "March to June, September to December",
      accessibility: "Wheelchair accessible main areas",
    },
    festivals: [
      {
        name: "Losar (Tibetan New Year)",
        date: "February–March",
        description: "The Tibetan New Year marked with multi‑day celebrations at Rumtek including prayers, music, and community festivities.",
        sources: [
          { label: "thesikkim.com", url: "https://www.thesikkim.com/destinations/rumtek-monastery-gangtok-sikkim?utm_source=chatgpt.com" },
        ],
      },
      {
        name: "Gutor / Guthor Cham",
        date: "February–March",
        description: "Ritual masked dances to purge negativities and obstacles before the New Year; performed near the end of the 12th Tibetan lunar month.",
        sources: [
          { label: "Windhorse Tours", url: "https://www.windhorsetours.com/festival/rumtek-guthor/?utm_source=chatgpt.com" },
        ],
      },
      {
        name: "Mahakala Protector Practice",
        date: "February–March",
        description: "Ten‑day protector deity practice culminating in the Mahakala cham on the 29th day; purification and protection rituals.",
        sources: [
          { label: "indovacations.net", url: "https://www.indovacations.net/english/Sikkim_Rumtekmonastery.htm?utm_source=chatgpt.com" },
        ],
      },
      {
        name: "Dungdrub Puja",
        date: "May–June",
        description: "Extensive pujas with mantra recitations for world peace and collective well‑being.",
        sources: [
          { label: "TripFactory", url: "https://holidays.tripfactory.com/sikkim/rumtek-monastery-guide/?utm_source=chatgpt.com" },
        ],
      },
      {
        name: "Vajrakilaya Drupchen",
        date: "May–June (alternate years)",
        description: "Ten‑day intensive practice dedicated to Vajrakilaya/Guru Padmasambhava with cham dances and elaborate rituals.",
        sources: [
          { label: "TripFactory", url: "https://holidays.tripfactory.com/sikkim/rumtek-monastery-guide/?utm_source=chatgpt.com" },
        ],
      },
      {
        name: "Birthday of the 17th Karmapa",
        date: "June (around 26th)",
        description: "Annual commemoration with sacred dance and cultural programs honoring His Holiness the 17th Karmapa.",
        sources: [
          { label: "TripFactory", url: "https://holidays.tripfactory.com/sikkim/rumtek-monastery-guide/?utm_source=chatgpt.com" },
        ],
      },
      {
        name: "Monks’ Retreat / Gakye",
        date: "July–August",
        description: "~45‑day summer retreat of the monastic community, concluding with dedicated ceremonies and prayers.",
        sources: [
          { label: "thesikkim.com", url: "https://www.thesikkim.com/destinations/rumtek-monastery-gangtok-sikkim?utm_source=chatgpt.com" },
        ],
      },
    ],
    rating: 4.8,
    reviews: 1247,
    category: "Major Monastery",
    tags: ["Karma Kagyu", "Virtual Tour", "Audio Guide", "Photography"],
  },
  {
    id: "pemayangtse",
    name: "Pemayangtse Monastery",
    location: "Pelling, West Sikkim",
    district: "West Sikkim",
    coordinates: { lat: 27.2951, lng: 88.2158 },
    description: "One of the oldest and most important monasteries in Sikkim, offering stunning views of Kanchenjunga.",
    history: "Founded in 1705 by Lama Lhatsun Chempo, it's the head monastery of the Nyingma order in Sikkim.",
    significance: "Only 'pure monks' (ta-tshang) are allowed to be admitted to this monastery.",
    founded: "1705",
    architecture: "Three-story structure with traditional Sikkimese architecture",
    images: [
      "/pemayangtse-monastery-sikkim-mountain-view.jpg",
      "/pemayangtse-monastery-interior-wooden-sculptures.jpg",
      "/pemayangtse-monastery-kanchenjunga-view.jpg",
    ],
    virtualTour: {
      available: true,
      scenes: [
        {
          id: "main-shrine",
          title: "Main Shrine Room",
          image: "/pemayangtse-monastery-shrine-room-360-view.jpg",
          hotspots: [
            { pitch: 0, yaw: 150, type: "scene", text: "Go to Top Floor", sceneId: "top-floor" },
          ],
        },
        {
          id: "top-floor",
          title: "Top Floor - Zangdok Palri",
          image: "/pemayangtse-monastery-top-floor-wooden-model-360.jpg",
          hotspots: [
            { pitch: 0, yaw: -30, type: "scene", text: "Back to Shrine Room", sceneId: "main-shrine" },
          ],
        },
      ],
    },
    audioGuide: {
      available: true,
      languages: ["English", "Hindi", "Nepali"],
      duration: "35 minutes",
    },
    visitingInfo: {
      openingHours: "7:00 AM - 5:00 PM",
      entryFee: "₹10 (Indians), ₹20 (Foreigners)",
      bestTimeToVisit: "October to December, March to May",
      accessibility: "Limited wheelchair access due to stairs",
    },
    festivals: [
      {
        name: "Guru Drakmar Chham / Cham Dance Festival",
        date: "February",
        description:
          "Traditional cham by lamas featuring Mahākāla and Guru Drag‑dmar/Vajrakilaya; marks the conclusion of Losar. The final day includes the unfurling of a large thangka and festivities.",
        sources: [
          { label: "goldentriangletour.com", url: "https://www.goldentriangletour.com/en/tourist-attractions/india/sikkim/pelling/pemayangtse-monastery-pelling.html?utm_source=chatgpt.com" },
          { label: "visittobengal.com", url: "https://www.visittobengal.com/pemayangtse-monastery-.php?utm_source=chatgpt.com" },
        ],
      },
    ],
    rating: 4.7,
    reviews: 892,
    category: "Historic Monastery",
    tags: ["Nyingma", "Mountain Views", "Historic", "Architecture"],
  },
  {
    id: "tashiding",
    name: "Tashiding Monastery",
    location: "Tashiding, West Sikkim",
    district: "West Sikkim",
    coordinates: { lat: 27.3333, lng: 88.2667 },
    description: "Sacred monastery believed to cleanse sins of those who visit with pure heart and devotion.",
    history: "Built in 1717 by Ngadak Sempa Chempo, it's considered one of the most sacred monasteries in Sikkim.",
    significance: "The sacred Bumchu ceremony is held here annually, predicting the year ahead for Sikkim.",
    founded: "1717",
    architecture: "Perched on a hilltop with panoramic views of the Himalayas",
    images: ["/tashiding-monastery-sikkim-sacred-site.jpg", "/tashiding-monastery-hilltop-view-prayer-flags.jpg", "/tashiding-monastery-bumchu-ceremony.jpg"],
    virtualTour: {
      available: false,
    },
    audioGuide: {
      available: true,
      languages: ["English", "Hindi", "Nepali"],
      duration: "25 minutes",
    },
    visitingInfo: {
      openingHours: "6:00 AM - 6:00 PM",
      entryFee: "Free",
      bestTimeToVisit: "October to March",
      accessibility: "Steep climb, not suitable for mobility issues",
    },
    festivals: [
      {
        name: "Bhumchu (Bumchu) Festival",
        date: "February–March (14–15th day of 1st Tibetan lunar month)",
        description:
          "Opening of the sealed holy water vase preserved for a year. The water’s state is believed to foretell the coming year’s fortunes, and blessed water is distributed to devotees.",
        sources: [
          { label: "Utsav", url: "https://utsav.gov.in/view-event/bumchu-festival?utm_source=chatgpt.com" },
          { label: "tibetanbuddhistencyclopedia.com", url: "https://tibetanbuddhistencyclopedia.com/en/index.php/Tashiding_Monastery?utm_source=chatgpt.com" },
        ],
      },
    ],
    rating: 4.6,
    reviews: 654,
    category: "Sacred Site",
    tags: ["Sacred", "Pilgrimage", "Ceremonies", "Hiking"],
  },
]

export function getMonasteryById(id: string): Monastery | undefined {
  return monasteries.find((monastery) => monastery.id === id)
}

export function getMonasteriesByDistrict(district: string): Monastery[] {
  return monasteries.filter((monastery) => monastery.district === district)
}

export function searchMonasteries(query: string): Monastery[] {
  const lowercaseQuery = query.toLowerCase()
  return monasteries.filter(
    (monastery) =>
      monastery.name.toLowerCase().includes(lowercaseQuery) ||
      monastery.location.toLowerCase().includes(lowercaseQuery) ||
      monastery.description.toLowerCase().includes(lowercaseQuery) ||
      monastery.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}
