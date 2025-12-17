export default function FeedTripCard({ trip }) {
  // Format Tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", { 
        day: "numeric", month: "short", year: "numeric" 
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 hover:border-primary/30 transition duration-300">
        <div className="flex justify-between items-start mb-4">
            <div className="flex gap-3">
                <img 
                    src={trip.user?.avatar || `https://ui-avatars.com/api/?name=${trip.user?.name}&background=random`} 
                    className="w-11 h-11 rounded-full border border-gray-200 object-cover"
                    alt="User"
                />
                <div>
                    <h4 className="font-bold text-gray-900 text-sm">{trip.user?.name}</h4>
                    {/* Waktu posting */}
                    <p className="text-[10px] text-gray-400 mt-0.5">
                        Baru Saja
                    </p>
                </div>
            </div>
            
            {/* Info Slot (Pengganti Titik Tiga) */}
            <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                    {/* Hitung slot statis 0 dulu */}
                    <span className="text-sm font-bold text-primary">0</span>
                    <span className="text-xs text-gray-400">/ {trip.max_participants}</span>
                </div>
                <p className="text-[10px] text-gray-400">Terisi</p>
            </div>
        </div>

        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 leading-tight">
            {trip.title}
        </h3>
        <p className="text-gray-600 mb-5 leading-relaxed text-xs md:text-sm">
            {trip.description}
        </p>

        {/* Info Grid */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-2 text-sm">
                <div>
                    <p className="text-[10px] text-gray-400 mb-1 font-bold uppercase tracking-wide">Tanggal</p>
                    <p className="font-bold text-gray-800 text-xs md:text-sm">{formatDate(trip.trip_date)}</p>
                </div>
                <div>
                    <p className="text-[10px] text-gray-400 mb-1 font-bold uppercase tracking-wide">Meeting Point</p>
                    <p className="font-bold text-gray-800 text-xs md:text-sm truncate" title={trip.meeting_point}>{trip.meeting_point}</p>
                </div>
                <div>
                    <p className="text-[10px] text-gray-400 mb-1 font-bold uppercase tracking-wide">Lokasi</p>
                    <p className="font-bold text-gray-800 text-xs md:text-sm truncate">{trip.hiking_trail?.name || 'Gunung'}</p>
                </div>
                <div>
                    <p className="text-[10px] text-gray-400 mb-1 font-bold uppercase tracking-wide">Status</p>
                    <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded font-bold text-[10px] inline-block">OPEN TRIP</span>
                </div>
            </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-3 border-t border-gray-100 pt-4">
            <button className="flex-1 bg-primary text-white text-sm font-bold py-2.5 rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-100">
                Gabung Trip Ini
            </button>
        </div>
    </div>
  );
}