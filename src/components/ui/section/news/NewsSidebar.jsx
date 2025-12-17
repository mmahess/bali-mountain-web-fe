import Link from "next/link";

export default function NewsSidebar({ newsList, currentSlug }) {
  // Filter berita agar berita yang sedang dibaca tidak muncul di sidebar
  const relatedNews = newsList ? newsList.filter(item => item.slug !== currentSlug).slice(0, 4) : [];

  return (
    <aside className="lg:col-span-1 space-y-8 font-sans">
        
        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Baca Juga</h3>
            
            <div className="space-y-4">
                {relatedNews.length > 0 ? (
                    relatedNews.map((item) => (
                        <Link href={`/berita/${item.slug}`} key={item.id} className="flex gap-3 group cursor-pointer">
                            <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                <img 
                                    src={item.thumbnail} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                    alt={item.title}
                                />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-primary transition line-clamp-2">
                                    {item.title}
                                </h4>
                                <p className="text-[10px] text-gray-400 mt-1">Info Terbaru</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-xs text-gray-400">Tidak ada berita lainnya.</p>
                )}
            </div>
            
            <Link href="/berita" className="block w-full mt-6 bg-gray-50 text-center text-gray-600 text-xs font-bold py-3 rounded-xl hover:bg-gray-100 transition">
                Lihat Semua Berita
            </Link>
        </div>

    </aside>
  );
}