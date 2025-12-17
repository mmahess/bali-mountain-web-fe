export default function MyTripCard({ trip }) {
  // Format Tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", { 
        day: "numeric", month: "short", year: "numeric" 
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border-l-4 border-primary">
        <div className="flex justify-between items-start mb-4">
            <div>
                <span className="bg-green-100 text-primary text-[10px] font-bold px-2 py-1 rounded mb-2 inline-block">AKTIF</span>
                <h3 className="text-lg font-bold text-gray-800">{trip.title}</h3>
                <p className="text-xs text-gray-500 mt-1">Dibuat: {formatDate(trip.created_at)}</p>
            </div>
            <div className="text-right">
                <p className="text-2xl font-bold text-gray-800">
                    {/* Placeholder peserta: 0 */}
                    0<span className="text-sm text-gray-400 font-normal">/{trip.max_participants}</span>
                </p>
                <p className="text-[10px] text-gray-400">Peserta</p>
            </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg mb-4 text-xs flex gap-4 text-gray-600 font-medium">
            <span>📅 {formatDate(trip.trip_date)}</span>
            <span>📍 {trip.meeting_point}</span>
        </div>

        <div className="flex gap-2 border-t border-gray-100 pt-4">
            <button className="flex-1 bg-white border border-gray-200 text-gray-600 text-sm font-bold py-2 rounded-lg hover:bg-gray-50 transition">
                Edit Info
            </button>
            <button className="flex-1 bg-white border border-gray-200 text-gray-600 text-sm font-bold py-2 rounded-lg hover:bg-gray-50 transition">
                Kelola Peserta
            </button>
            <button className="px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition border border-red-100">
                🗑
            </button>
        </div>
    </div>
  );
}