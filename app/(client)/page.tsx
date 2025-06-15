import { getServerSession } from "@/lib/get-server-session";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { FeatureCardsSection } from "@/components/home/feature-cards-section";
import { Suspense } from "react";

export default async function Home() {
  // Get session server-side
  const session = await getServerSession();

  return (
    <>
      <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Loading...</div>}>
        <HeroSection session={session} />
      </Suspense>
      <FeaturesSection />
      <FeatureCardsSection />
    </>
  );
}
