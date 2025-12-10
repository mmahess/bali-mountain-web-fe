import HeroDetail from "../../ui/section/detail/HeroDetail";
import StatsBar from "../../ui/section/detail/StatsBar";
import MainContent from "../../ui/section/detail/MainContent";
import SidebarDetail from "../../ui/section/detail/SidebarDetail";

export default function DetailPage({ mountain }) {
  return (
    <div className="bg-bg-soft min-h-screen pb-20 font-sans text-gray-700">
      <HeroDetail mountain={mountain} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-16 relative z-10">
        <StatsBar mountain={mountain} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <MainContent mountain={mountain} />
            <SidebarDetail mountain={mountain} />
        </div>
      </main>
    </div>
  );
}