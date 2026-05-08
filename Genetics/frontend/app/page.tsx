import { DNABackground } from "@/components/dna-background"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ProblemSection } from "@/components/problem-section"
import { WorkflowSection } from "@/components/workflow-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <DNABackground />
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <WorkflowSection />
      <Footer />
    </main>
  )
}
