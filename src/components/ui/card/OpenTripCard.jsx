import Link from "next/link";

export default function OpenTripCard({ trip, currentUser }) {
  // 1. Cek apakah user yang login adalah pemilik trip ini
  // (Pastikan currentUser dikirim dari parent component)
  const isOwner = currentUser && trip.user_id === currentUser.id;

  // 2. Format Tanggal (Contoh: 25 Des 2025)
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", { 
        day: "numeric", month: "short", year: "numeric" 
    });
  };

  // 3. Hitung Sisa Slot
  const remainingSlots = trip.max_participants - (trip.participants_count || 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col h-full group">
        
        {/* HEADER: User Info & Badge Status */}
        <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center gap-3">
                {/* Avatar Leader */}
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-200">
                    <img 
                        src={trip.user?.avatar || `https://ui-avatars.com/api/?name=${trip.user?.name || 'User'}&background=random`} 
                        alt={trip.user?.name} 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-0.5">Leader</p>
                    <p className="text-xs font-bold text-gray-700 line-clamp-1">{trip.user?.name || "Pendaki"}</p>
                </div>
            </div>

            {/* Status Badge */}
            {trip.status === 'full' ? (
                 <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Penuh</span>
            ) : (
                 <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Open</span>
            )}
        </div>

        {/* BODY: Informasi Trip */}
        <div className="p-4 flex-1 flex flex-col">
            {/* Judul Trip */}
            <h4 className="font-bold text-gray-800 mb-1 line-clamp-2 group-hover:text-primary transition text-sm md:text-base">
                {trip.title}
            </h4>
            
            {/* Lokasi Gunung */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                <span>📍</span> 
                <span className="font-medium">{trip.hiking_trail?.name || "Gunung Indonesia"}</span>
            </div>

            {/* Grid Info Kecil */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded-xl mb-4 mt-auto border border-gray-100">
                <div>
                    <span className="block text-gray-400 font-medium mb-0.5">Tanggal</span>
                    <span className="font-bold text-gray-700">{formatDate(trip.trip_date)}</span>
                </div>
                <div>
                    <span className="block text-gray-400 font-medium mb-0.5">Sisa Slot</span>
                    <span className={`font-bold ${remainingSlots > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {remainingSlots > 0 ? `${remainingSlots} Orang` : 'Full'}
                    </span>
                </div>
            </div>

            {/* FOOTER: Tombol Aksi */}
            <div className="mt-auto">
                {isOwner ? (
                    // Jika Pemilik: Tampilkan Label (Tidak bisa gabung trip sendiri)
                    <div className="w-full text-center bg-gray-100 border border-gray-200 text-gray-500 font-bold py-2.5 rounded-xl text-xs cursor-default">
                        👤 Trip Milik Anda
                    </div>
                ) : (
                    // Jika Orang Lain: Tombol Lihat Detail / Gabung
                    <Link 
                        href={`/komunitas/trip/${trip.id}`} 
                        className="w-full block text-center bg-white border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-xs hover:bg-primary hover:text-white hover:border-primary transition shadow-sm"
                    >
                        Lihat Detail & Gabung
                    </Link>
                )}
            </div>
        </div>
    </div>
  );
}