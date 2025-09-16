import dynamic from "next/dynamic"
const Hero = dynamic(() => import("@/components/landing/Hero"), { ssr: false })
import VirtualTours from "@/components/landing/VirtualTours"
import InteractiveMap from "@/components/landing/InteractiveMap"
import DigitalArchives from "@/components/landing/DigitalArchives"
import CulturalCalendar from "@/components/landing/CulturalCalendar"
import SmartAudioGuide from "@/components/landing/SmartAudioGuide"
import Newsletter from "@/components/landing/Newsletter"
import ContactForm from "@/components/landing/ContactForm"
import Footer from "@/components/landing/Footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <VirtualTours />
      <InteractiveMap />
      <DigitalArchives />
      <CulturalCalendar />
      <SmartAudioGuide />
      <Newsletter />
      <ContactForm />
      <Footer />
    </main>
  )
}
