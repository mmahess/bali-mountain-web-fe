export default function NewsSection() {
  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Berita Terbaru 📰</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-gray-50 rounded-3xl p-8 border border-gray-100 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-50"></div>
            <span className="text-[10px] font-bold text-white bg-red-500 px-3 py-1 rounded-full w-fit mb-4 shadow-lg shadow-red-200 z-10">PENTING</span>
            <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-primary transition z-10">Penutupan Jalur Rinjani: Pemulihan Ekosistem</h3>
            <p className="text-gray-500 text-sm mb-6 line-clamp-2 z-10">Mulai tanggal 1 Januari hingga 31 Maret, jalur pendakian Gunung Rinjani akan ditutup total untuk pemulihan ekosistem rutin tahunan.</p>
            <a href="#" className="text-primary font-bold text-sm hover:underline z-10">Baca Selengkapnya →</a>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-4 items-center hover:bg-gray-50 p-3 rounded-2xl transition cursor-pointer border border-transparent hover:border-gray-100">
              <div className="bg-gray-200 w-16 h-16 rounded-xl shrink-0 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=150" className="w-full h-full object-cover" alt="News"/>
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-800 line-clamp-2 leading-snug">Tips Memilih Sepatu Hiking agar Tidak Lecet di Kaki</h4>
                <p className="text-[10px] text-gray-400 mt-2">2 jam yang lalu</p>
              </div>
            </div>
            <div className="flex gap-4 items-center hover:bg-gray-50 p-3 rounded-2xl transition cursor-pointer border border-transparent hover:border-gray-100">
              <div className="bg-gray-200 w-16 h-16 rounded-xl shrink-0 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1541355966453-33df57452d3a?q=80&w=150" className="w-full h-full object-cover" alt="News"/>
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-800 line-clamp-2 leading-snug">Cuaca Buruk: Pendaki Gunung Agung Dihimbau Turun</h4>
                <p className="text-[10px] text-gray-400 mt-2">1 hari yang lalu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}