import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import VideoGrow from "@/components/landing/video-grow";
import Features from "@/components/landing/features";
import HowItWorks from "@/components/landing/how-it-works";
import Footer from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#20243b]">
        <Hero />
        <VideoGrow />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
