import Link from "next/link";
import NewsDetailContent from "@/components/ui/section/news/NewsDetailContent";
import NewsSidebar from "@/components/ui/section/news/NewsSidebar";

export default function NewsDetailPage({ newsDetail, newsList }) {
  if (!newsDetail) return null;

  // Format Tanggal Header
  const date = new Date(newsDetail.created_at).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="bg-bg-soft min-h-screen pb-20 font-sans text-gray-700">
        
        {/* --- HEADER --- */}
        <header className="bg-white pt-10 pb-8 border-b border-gray-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-4 font-medium">
                    <Link href="/berita" className="hover:text-primary">Berita</Link>
                    <span>/</span>
                    <span className="text-primary font-bold">Detail</span>
                </div>

                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {newsDetail.title}
                </h1>

                <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <img src="https://ui-avatars.com/api/?name=Admin+JejakKaki" className="w-8 h-8 rounded-full border border-gray-200" />
                        <span className="font-bold text-gray-900">Admin JejakKaki</span>
                    </div>
                    <span>•</span>
                    <span>{date}</span>
                    {/* "5 Menit Baca" SUDAH DIHAPUS */}
                </div>
            </div>
        </header>

        {/* --- MAIN CONTENT --- */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Kiri: Artikel */}
                <NewsDetailContent news={newsDetail} />

                {/* Kanan: Sidebar */}
                {/* Menggabungkan hotNews + latestNews untuk list sidebar */}
                <NewsSidebar 
                    newsList={newsList} 
                    currentSlug={newsDetail.slug} 
                />

            </div>
        </main>
    </div>
  );
}