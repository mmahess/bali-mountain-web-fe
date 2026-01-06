import BigNewsCard from "@/components/ui/card/BigNewsCard";
import NewsCard from "@/components/ui/card/NewsCard";

export default function NewsPage({ data }) {
  const { hotNews, latestNews } = data || {};

  return (
    <div className="bg-bg-soft min-h-screen pb-20 font-sans text-gray-700">
        
        {/* --- HEADER --- */}
        <header className="bg-white border-b border-gray-100 py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">Jurnal Pendaki</h1>
                <p className="text-gray-500 text-lg">Info terbaru seputar jalur, tips survival, dan review alat pendakian.</p>
            </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
            {hotNews ? (
                <BigNewsCard news={hotNews} />
            ) : (
                <div className="text-center py-10 text-gray-400">Belum ada Hot News.</div>
            )}

            <section>
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-4 mb-8 gap-4">
                    <h3 className="font-bold text-xl md:text-2xl text-gray-900">Artikel Terbaru</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {latestNews && latestNews.length > 0 ? (
                        latestNews.map((item) => (
                            <NewsCard key={item.id} news={item} />
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-400">Belum ada artikel terbaru.</p>
                        </div>
                    )}
                </div>

                {/* Tombol Load More (Visual Only) */}
                <div className="text-center pt-12 pb-4">
                    <button className="bg-white border border-gray-300 text-gray-600 font-bold py-3 px-8 rounded-full hover:bg-primary hover:text-white hover:border-primary transition shadow-sm">
                        Muat Artikel Lainnya
                    </button>
                </div>
            </section>

        </main>
    </div>
  );
}