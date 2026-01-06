import Link from "next/link";

// Fungsi Fetch Data (Langsung di Server Component)
async function getNews() {
  try {
    // PENTING: cache: 'no-store' agar selalu ambil data terbaru (realtime)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news`, { 
        cache: 'no-store' 
    });
    
    if (!res.ok) throw new Error("Gagal load berita");
    return await res.json();
  } catch (error) {
    console.error("Error fetch news:", error);
    return { data: { hotNews: null, latestNews: [] } };
  }
}

// --- HELPER URL GAMBAR ---
const getImageUrl = (path) => {
  if (!path) return "https://placehold.co/600x400?text=No+Image";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}/storage/${path}`;
};

export default async function HomeNewsSection() {
  const { data } = await getNews();
  const { hotNews, latestNews } = data || {};

  // Ambil 3 berita terbaru saja untuk list samping
  const sideNews = latestNews ? latestNews.slice(0, 3) : [];

  return (
    <section className="py-16 px-4 bg-white font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-10">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Berita & Tips Pendakian</h2>
                <p className="text-gray-500">Update info jalur, tips survival, dan cerita pendaki.</p>
            </div>
            <Link href="/berita" className="text-primary font-bold hover:underline">
                Lihat Semua →
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* KIRI: HOT NEWS (Berita Utama) */}
            {hotNews ? (
                <div className="group relative rounded-3xl overflow-hidden h-[400px] shadow-md hover:shadow-xl transition">
                    <img 
                        // GUNAKAN HELPER DISINI
                        src={getImageUrl(hotNews.thumbnail)} 
                        alt={hotNews.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                        <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-3">
                            HOT NEWS
                        </span>
                        <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-green-400 transition">
                            <Link href={`/berita/${hotNews.slug}`}>{hotNews.title}</Link>
                        </h3>
                        <p className="text-gray-300 text-sm line-clamp-2 mb-4">{hotNews.excerpt}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span>📅 {new Date(hotNews.created_at).toLocaleDateString("id-ID")}</span>
                            <span>👤 {hotNews.user?.name || "Admin"}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-[400px] bg-gray-100 rounded-3xl flex items-center justify-center text-gray-400">
                    Belum ada berita utama.
                </div>
            )}

            {/* KANAN: LIST BERITA TERBARU */}
            <div className="flex flex-col gap-6">
                {sideNews.length > 0 ? (
                    sideNews.map((news) => (
                        <div key={news.id} className="flex gap-5 group items-start">
                            {/* Gambar Kecil */}
                            <div className="w-32 h-24 shrink-0 rounded-xl overflow-hidden relative">
                                <img 
                                    // GUNAKAN HELPER DISINI JUGA
                                    src={getImageUrl(news.thumbnail)} 
                                    alt={news.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                />
                            </div>
                            
                            {/* Teks */}
                            <div className="flex-1 py-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-bold text-primary bg-green-50 px-2 py-0.5 rounded">
                                        {news.category || "Tips"}
                                    </span>
                                    <span className="text-[10px] text-gray-400">
                                        {new Date(news.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long' })}
                                    </span>
                                </div>
                                <h4 className="font-bold text-gray-800 text-lg leading-snug mb-1 group-hover:text-primary transition line-clamp-2">
                                    <Link href={`/berita/${news.slug}`}>{news.title}</Link>
                                </h4>
                                <p className="text-xs text-gray-500 line-clamp-1">{news.excerpt}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 italic">Belum ada berita terbaru.</p>
                )}
            </div>

        </div>
      </div>
    </section>
  );
}