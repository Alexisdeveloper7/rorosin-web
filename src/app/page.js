import PortfolioFooter from "@/components/PortfolioFooter";
import PortfolioHeader from "@/components/PortfolioHeader";

import {
  HeroSection,
  ProjectsSection,
  ReviewsSection,
  AboutSection,
  ContactSection,
} from "@/components/portfolio/sections";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#09060f] text-white">
<PortfolioHeader />
      <HeroSection />

      <AboutSection />

      <ProjectsSection />

      <ReviewsSection />

      <ContactSection />

      <div className="bg-[#09060f]">
        <PortfolioFooter />
      </div>
    </div>
  );
}