import Link from "next/link";

export default function NewsCard({ news }) {
  // --- PERBAIKAN: Hapus logika random category ---
  
  // Helper warna kategori berdasarkan isi data
  const getCatColor = (cat) => {
      if (!cat) return "text-primary";
      
      const lowerCat = cat.toLowerCase();
      if(lowerCat.includes("info jalur")) return "text-blue-600";
      if(lowerCat.includes("review")) return "text-orange-600";
      if(lowerCat.includes("event")) return "text-purple-600";
      
      return "text-primary"; // Default Hijau (untuk Tips, Cerita, dll)
  }

  // Helper URL Gambar
  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/600x400?text=No+Image";
    if (path.startsWith("http")) return path;
    return `http://127.0.0.1:8000/storage/${path}`;
  };

  return (
    <Link href={`/berita/${news.slug}`} className="block h-full">
      <article className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-lg transition duration-300 group cursor-pointer overflow-hidden flex flex-col h-full border border-gray-100">
        
        {/* Gambar Thumbnail */}
        <div className="h-48 overflow-hidden relative">
            <img 
                src={getImageUrl(news.thumbnail)} 
                alt={news.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
            />
            <div className="absolute top-3 left-3">
                 {/* GUNAKAN KATEGORI ASLI DARI DATABASE */}
                 <span className={`text-[10px] font-bold ${getCatColor(news.category)} bg-white/90 backdrop-blur px-2 py-1 rounded shadow-sm uppercase`}>
                    {news.category || "UMUM"}
                 </span>
            </div>
        </div>

        {/* Konten */}
        <div className="p-5 flex flex-col grow">
            <div className="text-[10px] text-gray-400 mb-2 flex items-center gap-2">
                <span>📅 {new Date(news.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-primary transition line-clamp-2 leading-snug">
                {news.title}
            </h4>
            <p className="text-sm text-gray-500 line-clamp-3 mb-4 grow leading-relaxed">
                {news.excerpt}
            </p>
            <span className="text-xs font-bold text-secondary flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                Baca Selengkapnya →
            </span>
        </div>
      </article>
    </Link>
  );
}