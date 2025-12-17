"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function FeedTripCard({ trip, currentUser, onDetail }) {
  const [isLoading, setIsLoading] = useState(false);
  
  // 1. Cek Status User terhadap Trip ini
  const isOwner = currentUser && parseInt(trip.user_id) === parseInt(currentUser?.id);
  const isJoined = trip.participants?.some(p => parseInt(p.id) === parseInt(currentUser?.id));
  const remainingSlots = trip.max_participants - (trip.participants_count || 0);

  // 2. Format Tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", { 
        day: "numeric", month: "short", year: "numeric" 
    });
  };

  // 3. Logic Gabung Trip
  const handleJoin = async () => {
    if (!currentUser) return toast.error("Silakan login dulu");
    
    setIsLoading(true);
    const toastId = toast.loading("Bergabung...");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/api/open-trips/${trip.id}/join`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Berhasil gabung!", { id: toastId });
      window.location.reload(); // Refresh halaman untuk update status
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition flex flex-col h-full">
        
        {/* HEADER: Leader Info */}
        <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-3">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
                    <img 
                        src={trip.user?.avatar || `https://ui-avatars.com/api/?name=${trip.user?.name || 'User'}&background=random`} 
                        alt={trip.user?.name} 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-1">Leader</p>
                    <p className="text-sm font-bold text-gray-900 line-clamp-1">{trip.user?.name}</p>
                </div>
            </div>
            
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${remainingSlots > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {remainingSlots > 0 ? `${remainingSlots} Slot` : 'Full'}
            </span>
        </div>

        {/* BODY: Info Trip */}
        <div className="mb-4 flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-1 leading-snug line-clamp-2">{trip.title}</h3>
            
            {/* Deskripsi Singkat */}
            <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                {trip.description}
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <span>📍</span> 
                <span className="font-medium truncate">{trip.hiking_trail?.name || "Lokasi Gunung"}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Tanggal</p>
                    <p className="text-sm font-bold text-gray-700">{formatDate(trip.trip_date)}</p>
                </div>
                <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Peserta</p>
                    <p className="text-sm font-bold text-gray-700">
                        {trip.participants_count || 0} / {trip.max_participants}
                    </p>
                </div>
            </div>
        </div>

        {/* FOOTER: Tombol Aksi */}
        <div className="flex gap-2 mt-auto">
            {/* Tombol Detail (Buka Modal) */}
            <button 
                onClick={() => onDetail(trip)} 
                className="flex-1 bg-white border border-gray-200 text-gray-600 text-xs font-bold py-3 rounded-xl text-center hover:bg-gray-50 transition"
            >
                Info Detail
            </button>
            
            {/* Logika Tombol Kanan */}
            {isOwner ? (
                 <button disabled className="flex-1 bg-gray-100 text-gray-400 text-xs font-bold py-3 rounded-xl cursor-default">
                    👤 Owner
                 </button>
            ) : isJoined ? (
                 <button disabled className="flex-1 bg-gray-100 text-green-600 text-xs font-bold py-3 rounded-xl cursor-default border border-gray-200">
                    ✅ Joined
                 </button>
            ) : remainingSlots > 0 ? (
                 <button 
                    onClick={handleJoin}
                    disabled={isLoading}
                    className="flex-1 bg-green-600 text-white text-xs font-bold py-3 rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-100 disabled:opacity-50"
                 >
                    {isLoading ? "..." : "Gabung"}
                 </button>
            ) : (
                <button disabled className="flex-1 bg-red-50 text-red-400 text-xs font-bold py-3 rounded-xl cursor-not-allowed">
                    Penuh
                </button>
            )}
        </div>
    </div>
  );
}