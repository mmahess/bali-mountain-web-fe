import HeroSection from "../../ui/section/HeroSection";
import CommunitySection from "../../ui/section/CommunitySection";
import PopularTrails from "../../ui/section/PopularTrails";
import NewsSection from "../../ui/section/NewsSection";

export default function HomePage({ data }) {
  const { trails, trips, gallery, news} = data || {};

  return (
    <>
      <HeroSection />
      <CommunitySection trips={trips} gallery={gallery} />
      <PopularTrails mountains={trails || []} />
      <NewsSection news={news} />
    </>
  );
}