import Link from "next/link";

export default function CommunitySection({ trips, gallery }) {
  
  // Format Tanggal
  const formatDate = (dateString) => {
    if(!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  };

  // Helper URL Gambar (Backend Laravel)
  const getImageUrl = (filename) => {
    return filename ? `${process.env.NEXT_PUBLIC_API_URL}/storage/images/${filename}` : "https://via.placeholder.com/150";
  };

  return (
    <section className="py-8 bg-bg-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Aktivitas Komunitas ⛺</h2>
            <p className="text-gray-500 text-sm mt-1">Lihat siapa yang sedang mencari tim.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* --- KOLOM KIRI: OPEN TRIP LIST --- */}
          <div className="lg:col-span-2 space-y-4">
            
            {trips && trips.length > 0 ? (
              trips.map((trip) => (
                <div key={trip.id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-card hover:border-primary transition group flex flex-col md:flex-row gap-5 items-start">
                  
                  {/* Foto User / Avatar */}
                  <div className="shrink-0 text-center md:w-16">
                    <img 
                      src={trip.user?.avatar || `https://ui-avatars.com/api/?name=${trip.user?.name || 'U'}&background=random`} 
                      className="w-12 h-12 rounded-full mx-auto mb-2 border-2 border-white shadow-md object-cover"
                      alt="User"
                    />
                    <p className="text-[10px] font-bold text-gray-900 truncate w-16 mx-auto">
                      {trip.user?.name || "Pendaki"}
                    </p>
                  </div>

                  {/* Info Trip */}
                  <div className="grow w-full">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-bold text-gray-800 group-hover:text-primary transition line-clamp-1">
                        {trip.title}
                      </h4>
                      <span className="bg-green-50 text-green-600 text-[10px] font-bold px-3 py-1 rounded-full border border-green-100 shrink-0">
                        Open
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed">
                      {trip.description || `Trip seru ke ${trip.destination || 'Gunung'}!`}
                    </p>
                    
                    {/* Badge Info */}
                    <div className="flex flex-wrap gap-2 text-[10px] font-bold text-gray-600">
                      <span className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        🗓 {formatDate(trip.date)}
                      </span>
                      <span className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        📍 {trip.destination || 'Lokasi'}
                      </span>
                      <span className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        👥 Max {trip.max_participants || 5} Org
                      </span>
                    </div>
                  </div>

                  {/* Tombol Gabung */}
                  <div className="w-full md:w-auto mt-2 md:mt-0 self-center">
                    <Link href="/komunitas">
                        <button className="w-full bg-primary text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-green-700 shadow-lg shadow-green-100 whitespace-nowrap">
                        Gabung
                        </button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border-dashed border-2 border-gray-200 rounded-3xl p-8 text-center">
                <p className="text-gray-400 font-medium mb-2">Belum ada Open Trip aktif.</p>
              </div>
            )}

            <Link href="/komunitas">
                <button className="w-full py-4 border-2 border-dashed border-gray-300 text-gray-400 text-sm font-bold rounded-3xl hover:border-primary hover:text-primary hover:bg-green-50 transition flex items-center justify-center gap-2">
                <span>+</span> Buat Ajakan Pendakian Baru
                </button>
            </Link>
          </div>

          {/* --- KOLOM KANAN: GALERI --- */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl shadow-card h-full border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 text-sm">Momen Hari Ini 📸</h3>
                <span className="text-[10px] text-gray-400">{gallery ? gallery.length : 0} Updated</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {gallery && gallery.length > 0 ? (
                  gallery.slice(0, 4).map((item, idx) => (
                    <div key={item.id} className={`rounded-xl overflow-hidden relative group aspect-square`}>
                         {/* FIX IMAGE URL DISINI */}
                         <img 
                            src={getImageUrl(item.image)} 
                            className="w-full h-full object-cover hover:scale-110 transition duration-500 cursor-pointer"
                            alt="Momen"
                         />
                    </div>
                  ))
                ) : (
                   <div className="col-span-2 text-center text-xs text-gray-300 py-10">Belum ada foto</div>
                )}
              </div>
              
              <Link href="/komunitas">
                <button className="text-primary text-xs font-bold hover:underline w-full text-center mt-4">Lihat Semua Galeri →</button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}