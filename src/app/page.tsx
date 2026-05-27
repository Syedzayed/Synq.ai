import { AuroraBackground } from "@/components/landing/aurora-background";
import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { SocialProof } from "@/components/landing/social-proof";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { AiPreview } from "@/components/landing/ai-preview";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <>
      {/* Ambient aurora background — fixed behind all content */}
      <AuroraBackground />

      {/* Sticky navigation */}
      <Navbar />

      <main>
        {/* 1. Hero */}
        <HeroSection />

        {/* 2. Social proof stats */}
        <SocialProof />

        {/* 3. Features grid */}
        <FeaturesSection />

        {/* 4. How it works */}
        <HowItWorks />

        {/* 5. AI chat preview */}
        <AiPreview />

        {/* 6. Final CTA */}
        <CtaSection />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
