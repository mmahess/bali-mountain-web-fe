import HeroSection from "../../ui/section/HeroSection";
import CommunitySection from "../../ui/section/CommunitySection";
import PopularTrails from "../../ui/section/PopularTrails";
import NewsSection from "../../ui/section/NewsSection";

export default function HomePage({ mountains }) {
  return (
    <>
      <HeroSection />
      <CommunitySection />
      <PopularTrails mountains={mountains} />
      <NewsSection />
    </>
  );
}