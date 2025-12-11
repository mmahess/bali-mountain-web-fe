import Link from "next/link";

export default function NewsSection({ news }) {
  // Bongkar data news (important & list)
  const { important, list } = news || {};

  // Fungsi helper format tanggal relative (Contoh: "2 jam yang lalu")
  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
    return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
  };

  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Berita Terbaru 📰</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* --- BERITA PENTING (BIG CARD) --- */}
          <div className="md:col-span-2 bg-gray-50 rounded-3xl p-8 border border-gray-100 flex flex-col justify-center relative overflow-hidden group min-h-[300px]">
            {important ? (
              <>
                 {/* Background Image Samar */}
                 <div className="absolute inset-0 z-0">
                    <img src={important.thumbnail} className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition duration-700"/>
                    <div className="absolute inset-0 bg-linear-to-r from-gray-50 via-gray-50/90 to-transparent"></div>
                 </div>

                 {/* Blob Hiasan */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-50 z-0"></div>
                
                <div className="relative z-10">
                    <span className="text-[10px] font-bold text-white bg-red-500 px-3 py-1 rounded-full w-fit mb-4 shadow-lg shadow-red-200 inline-block">
                        PENTING
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800 group-hover:text-primary transition">
                        {important.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed max-w-lg">
                        {important.excerpt}
                    </p>
                    <Link href={`/berita/${important.slug}`} className="text-primary font-bold text-sm hover:underline flex items-center gap-2">
                        Baca Selengkapnya <span>→</span>
                    </Link>
                </div>
              </>
            ) : (
                <div className="text-center text-gray-400 py-10">Belum ada berita penting.</div>
            )}
          </div>
          
          {/* --- LIST BERITA LAIN --- */}
          <div className="space-y-4">
            {list && list.length > 0 ? (
                list.map((item) => (
                    <Link href={`/berita/${item.slug}`} key={item.id} className="flex gap-4 items-center hover:bg-gray-50 p-3 rounded-2xl transition cursor-pointer border border-transparent hover:border-gray-100 group">
                        <div className="bg-gray-200 w-20 h-20 rounded-xl shrink-0 overflow-hidden shadow-sm">
                             <img src={item.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition duration-500"/>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-gray-800 line-clamp-2 leading-snug group-hover:text-primary transition">
                                {item.title}
                            </h4>
                            <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                                🕒 {timeAgo(item.created_at)}
                            </p>
                        </div>
                    </Link>
                ))
            ) : (
                <div className="text-center text-gray-400 text-sm py-10">Belum ada berita terbaru.</div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}