import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import VideoGrow from "@/components/landing/video-grow";
import Features from "@/components/landing/features";
import HowItWorks from "@/components/landing/how-it-works";
import CircularCTASection from "@/components/landing/circular-cta";
import Footer from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: "var(--dark)" }}>
        <Hero />
        <VideoGrow />
        <Features />
        <HowItWorks />
        <CircularCTASection />
      </main>
      <Footer />
    </>
  );
}
