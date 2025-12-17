export default function JoinedTripCard({ trip }) {
  // Format Tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", { 
        day: "numeric", month: "short", year: "numeric" 
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border-l-4 border-blue-500">
        <div className="flex items-center gap-4 mb-4 border-b border-gray-100 pb-4">
            <img 
                src={trip.user?.avatar || `https://ui-avatars.com/api/?name=${trip.user?.name}&background=random`} 
                className="w-12 h-12 rounded-full border border-gray-200 object-cover"
                alt="Leader"
            />
            <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Leader</p>
                <h4 className="font-bold text-gray-900 text-sm">{trip.user?.name}</h4>
            </div>
            
            <div className="ml-auto text-right">
                {/* Placeholder peserta: 1 (User sendiri) */}
                <p className="text-xl font-bold text-primary">1<span class="text-sm text-gray-400 font-normal">/{trip.max_participants}</span></p>
                <p className="text-[10px] text-gray-400">Peserta</p>
            </div>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-2">{trip.title}</h3>
        
        <div className="bg-gray-50 p-4 rounded-xl mb-5 grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
                <span className="block text-[10px] text-gray-400 font-bold uppercase">Tanggal</span>
                <span className="font-bold">{formatDate(trip.trip_date)}</span>
            </div>
            <div>
                <span className="block text-[10px] text-gray-400 font-bold uppercase">Meeting Point</span>
                <span className="font-bold">{trip.meeting_point}</span>
            </div>
        </div>

        <div className="flex gap-3">
            <button className="flex-1 bg-primary text-white text-sm font-bold py-2.5 rounded-xl hover:bg-green-700 shadow-md shadow-green-100 flex justify-center items-center gap-2 transition">
                <span>💬</span> Buka Grup Chat
            </button>
            <button className="px-4 border border-red-200 text-red-500 rounded-xl font-bold text-sm hover:bg-red-50 transition">
                Batal Ikut
            </button>
        </div>
    </div>
  );
}