import { HeroSection } from '@/components/landing/HeroSection'
import { ProblemSection } from '@/components/landing/ProblemSection'
import { DifferentiatorSection } from '@/components/landing/DifferentiatorSection'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { TargetSection } from '@/components/landing/TargetSection'
import { ProductSection } from '@/components/landing/ProductSection'
import { PackagesSection } from '@/components/landing/PackagesSection'
import { SocialProof } from '@/components/landing/SocialProof'
import { CtaSection } from '@/components/landing/CtaSection'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <HeroSection />
        <ProblemSection />
        <DifferentiatorSection />
        <HowItWorks />
        <TargetSection />
        <ProductSection />
        <PackagesSection />
        <SocialProof />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
