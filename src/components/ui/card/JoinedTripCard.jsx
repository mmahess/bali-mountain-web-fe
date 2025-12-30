"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function JoinedTripCard({ trip, onLeaveSuccess, onDetail }) {
  const [isLoading, setIsLoading] = useState(false);

  // Format Tanggal
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", { 
        day: "numeric", month: "short", year: "numeric" 
    });
  };

  // Logic Keluar Trip
  const handleLeave = async () => {
    if(!confirm(`Yakin ingin membatalkan join di trip "${trip.title}"?`)) return;

    setIsLoading(true);
    const toastId = toast.loading("Proses keluar...");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/open-trips/${trip.id}/leave`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Berhasil keluar trip", { id: toastId });
      
      // Refresh list di halaman parent
      if (onLeaveSuccess) onLeaveSuccess(); 

    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col h-full hover:shadow-md transition">
        
        {/* Header Leader */}
        <div className="flex items-center gap-3 mb-4 border-b border-gray-50 pb-3">
            <img 
                src={trip.user?.avatar || `https://ui-avatars.com/api/?name=${trip.user?.name}`} 
                className="w-9 h-9 rounded-full bg-gray-200 object-cover" 
                alt="Leader"
            />
            <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Leader</p>
                <p className="text-sm font-bold text-gray-800 line-clamp-1">{trip.user?.name}</p>
            </div>
        </div>

        {/* Body Info */}
        <div className="flex-1 mb-4">
            <h4 className="font-bold text-gray-800 mb-1 leading-snug line-clamp-2">{trip.title}</h4>
            
            <p className="text-xs text-gray-500 line-clamp-2 mb-3 text-justify">
                {trip.description}
            </p>
            
            <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                <span>📍</span> {trip.hiking_trail?.name}
            </p>

            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-blue-600 font-bold">📅 {formatDate(trip.trip_date)}</span>
                    <span className="text-gray-500 font-bold">{trip.participants_count} Peserta</span>
                </div>
                {trip.group_chat_link && (
                    <a href={trip.group_chat_link} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-1 mt-2">
                        💬 Grup WhatsApp
                    </a>
                )}
            </div>
        </div>

        {/* Footer Tombol */}
        <div className="flex gap-2 mt-auto">
            <button 
                onClick={() => onDetail(trip)}
                className="flex-1 bg-gray-50 text-gray-600 text-xs font-bold py-2.5 rounded-xl text-center hover:bg-gray-100 transition"
            >
                Info Detail
            </button>
            
            <button 
                onClick={handleLeave} 
                disabled={isLoading}
                className="flex-1 bg-white border border-red-100 text-red-500 text-xs font-bold py-2.5 rounded-xl hover:bg-red-50 hover:border-red-200 transition"
            >
                {isLoading ? "..." : "Keluar Trip"}
            </button>
        </div>
    </div>
  );
}