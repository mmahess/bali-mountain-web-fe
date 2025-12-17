import Link from "next/link";

export default function BigNewsCard({ news }) {
  if (!news) return null;

  return (
    <Link href={`/berita/${news.slug}`} className="block group mb-12">
      <div className="relative rounded-4xl overflow-hidden h-[400px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300">
        
        {/* Gambar Background */}
        <img 
            src={news.thumbnail || "https://placehold.co/1200x600"} 
            alt={news.title}
            className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent"></div>
        
        {/* Konten Text */}
        <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-2/3">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block shadow-md">
                HOT NEWS
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 leading-tight group-hover:text-green-300 transition">
                {news.title}
            </h2>
            <p className="text-gray-300 text-sm md:text-base mb-4 line-clamp-2 leading-relaxed">
                {news.excerpt}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                <span className="flex items-center gap-1">
                    📅 {new Date(news.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">🕒 4 min read</span>
                <span className="flex items-center gap-1">✍ Admin JejakKaki</span>
            </div>
        </div>
      </div>
    </Link>
  );
}