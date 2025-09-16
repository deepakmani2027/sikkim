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
      narration?: {
        [lang: string]: {
          text: string
          audioUrl?: string
        }
      }
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
      narration?: {
        [langCode: string]: {
          text?: string
          audioUrl?: string
        }
      }
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
          narration: {
            en: {
              text:
                "You are in Rumtek’s main prayer hall. Notice the golden Buddha statue, vibrant murals, and thangkas that narrate Buddhist teachings and lineage history.",
            },
            hi: {
              text:
                "आप रुमटेक के मुख्य प्रार्थना कक्ष में हैं। सुनहरे बुद्ध प्रतिमा, जीवंत भित्तिचित्र और थांका परंपरा और बौद्ध शिक्षाओं की कथा कहते हैं।",
            },
            ne: {
              text:
                "तपाईं रुमटेकको मुख्य प्रार्थना हलमा हुनुहुन्छ। सुनौलो बुद्ध मूर्ति, रङ्गीन भित्तेचित्र र थाङ्काहरूले बौद्ध शिक्षाहरूको कथा सुनाउँछन्।",
            },
            fr: { text: "Vous êtes dans la grande salle de prière de Rumtek. Remarquez la statue dorée du Bouddha et les fresques colorées racontant les enseignements bouddhistes." },
            ja: { text: "ここはルムテック僧院の本堂です。金色の仏像と、教えを物語る色鮮やかな壁画に注目してください。" },
            zh: { text: "您正置身于鲁姆泰寺的大殿。请留意金色佛像与色彩斑斓的壁画，它们讲述着佛教的教义与传承。" },
          },
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
          narration: {
            en: { text: "This is the main courtyard where festivals and cham dances take place. Prayer wheels line the walls inviting blessings." },
            hi: { text: "यह मुख्य आँगन है जहाँ त्योहार और छम नृत्य होते हैं। दीवारों के साथ प्रार्थना चक्के आशीर्वाद के लिए आमंत्रित करते हैं।" },
            ne: { text: "यो मुख्य आँगन हो जहाँ पर्व र छाम नृत्यहरू हुने गर्छन्। भित्ताहरूमा प्रार्थना चर्खाहरूले आशीर्वादको निम्ति बोलाउँछन्।" },
            fr: { text: "Voici la cour principale où ont lieu les festivals et danses cham. Les moulins à prières longent les murs." },
            ja: { text: "ここは祭りやチャム舞が行われる中庭です。祈祷輪が壁沿いに並んでいます。" },
            zh: { text: "这是举行节庆与羌姆舞的主庭院。转经轮沿墙排列，祈愿祝福。" },
          },
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
          narration: {
            en: { text: "Pemayangtse’s shrine holds ancient images and sacred objects of the Nyingma tradition. Observe the serene arrangement and murals." },
            hi: { text: "पेमायंग्त्से का मुख्य श्राइन न्यिंगमा परम्परा की प्राचीन मूर्तियाँ और पवित्र वस्तुओं को संजोए है।" },
            ne: { text: "पेमायाङ्त्सेको मुख्य देवालयमा न्यिङ्मा परम्पराका प्राचीन मूर्तिहरू र पवित्र सामग्रीहरू छन्।" },
            fr: { text: "Le sanctuaire de Pemayangtse conserve des images anciennes et des objets sacrés de la tradition Nyingma." },
            ja: { text: "ペマヤンツェの本殿にはニンマ派の聖なる遺物や古像が安置されています。" },
            zh: { text: "白玛央则寺的大殿供奉着宁玛派的古老造像与圣物。" },
          },
          hotspots: [
            { pitch: 0, yaw: 150, type: "scene", text: "Go to Top Floor", sceneId: "top-floor" },
          ],
        },
        {
          id: "top-floor",
          title: "Top Floor - Zangdok Palri",
          image: "/pemayangtse-monastery-top-floor-wooden-model-360.jpg",
          narration: {
            en: { text: "The top floor features the exquisite wooden model of Zangdok Palri, symbolizing Guru Rinpoche’s pure land." },
            hi: { text: "शीर्ष तल पर ज़ंगडोक पलरी का सुंदर काठका नमूना है, जो गुरु रिनपोछे की शुद्ध भूमि का प्रतीक है।" },
            ne: { text: "माथिल्लो तलमा जंगडोक पल्रीको उत्कृष्ट काठको नमूना छ, गुरु रिनपोचेको शुद्ध भूमिको प्रतीक।" },
            fr: { text: "L’étage supérieur abrite le modèle en bois de Zangdok Palri, la terre pure de Gourou Rinpoché." },
            ja: { text: "最上階にはグル・リンポチェの浄土『ザンドク・パリ』の精巧な木製模型があります。" },
            zh: { text: "顶层陈列着精美的木制“桑多白利”模型，象征莲师的净土。" },
          },
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
    images: [
      "/tashiding-monastery-sikkim-sacred-site.jpg",
      "/tashiding-monastery-hilltop-view-prayer-flags.jpg",
      "/tashiding-monastery-bumchu-ceremony.jpg",
    ],
    virtualTour: {
      available: true,
      scenes: [
        {
          id: "interior",
          title: "Main Shrine Interior",
          image: "/virtual-tour-interior.jpg",
          narration: {
            en: { text: "Inside Tashiding’s shrine, murals and sacred objects illustrate teachings and the monastery’s revered spiritual heritage." },
            hi: { text: "ताशी딩 के गर्भगृह में भित्ति-चित्र और पवित्र वस्तुएँ इसकी आध्यात्मिक परम्परा और शिक्षाओं को दर्शाती हैं।" },
            ne: { text: "ताशी्डिङको गर्भगृहभित्र भित्तेचित्र र पवित्र सामग्रीहरूले यसको आध्यात्मिक परम्परा र शिक्षाहरू झल्काउँछन्।" },
            fr: { text: "Au sanctuaire de Tashiding, fresques et objets sacrés illustrent l’héritage spirituel du monastère." },
            ja: { text: "タシディンの内陣では、壁画や聖なる法具が教えと霊的遺産を物語ります。" },
            zh: { text: "在塔希丁寺的殿内，壁画与圣物展示了其珍贵的精神传承与教义。" },
          },
          hotspots: [
            {
              pitch: 0,
              yaw: 0,
              type: "info",
              text: "Altar and sacred artifacts of Tashiding",
            },
          ],
        },
      ],
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
    tags: ["Sacred", "Pilgrimage", "Ceremonies", "Hiking", "Virtual Tour"],
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
