"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function MyTripCard({ trip, onEdit, onDeleteSuccess, onManage }) {
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Format Tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", { 
      day: "numeric", month: "short", year: "numeric" 
    });
  };

  // 2. Fungsi Hapus Trip
  const handleDelete = async () => {
    if(!confirm("Yakin ingin menghapus ajakan ini? Data tidak bisa dikembalikan.")) return;
    
    setIsDeleting(true);
    const toastId = toast.loading("Menghapus...");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/open-trips/${trip.id}`, {
        method: "DELETE",
        headers: { 
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json" 
        }
      });

      if (!res.ok) throw new Error("Gagal menghapus");

      toast.success("Ajakan dihapus", { id: toastId });
      
      // Refresh list di parent component
      if (onDeleteSuccess) onDeleteSuccess(); 

    } catch (error) {
      toast.error("Gagal menghapus", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col md:flex-row gap-5 items-start">
        
        {/* BAGIAN KIRI: Informasi Utama Trip */}
        <div className="flex-1 w-full">
            {/* Status & Tanggal */}
            <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    trip.status === 'open' ? 'bg-green-100 text-green-700' : 
                    trip.status === 'full' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                }`}>
                    {trip.status}
                </span>
                <span className="text-xs text-gray-400">• {formatDate(trip.trip_date)}</span>
            </div>
            
            {/* Judul & Lokasi */}
            <h3 className="text-lg font-bold text-gray-800 mb-1">{trip.title}</h3>
            <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                <span>📍</span> {trip.hiking_trail?.name || "Gunung"} • {trip.meeting_point}
            </p>
            
            {/* Statistik Kecil */}
            <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-600 bg-gray-50 p-3 rounded-xl w-full md:w-fit">
                <div>
                    <span className="block text-gray-400 text-[10px] uppercase font-bold">Peserta</span>
                    <span className="text-gray-800 font-bold">{trip.participants_count || 0}</span> / {trip.max_participants}
                </div>
                <div className="w-px bg-gray-200 hidden md:block"></div>
                <div className="md:pl-2">
                    <span className="block text-gray-400 text-[10px] uppercase font-bold">Grup Chat</span>
                    {trip.group_chat_link ? (
                        <a href={trip.group_chat_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-bold">
                            Buka Link ↗
                        </a>
                    ) : (
                        <span className="text-gray-400">-</span>
                    )}
                </div>
            </div>
        </div>

        {/* BAGIAN KANAN: Tombol Aksi */}
        <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-5">
            
            {/* Tombol Edit */}
            <button 
                onClick={() => onEdit(trip)} 
                className="flex-1 md:flex-none bg-blue-50 text-blue-600 text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-blue-100 transition border border-blue-100 flex justify-center items-center gap-2"
            >
                <span>✏️</span> Edit
            </button>
            
            {/* Tombol Kelola Peserta (Memanggil Modal) */}
            <button 
                onClick={() => onManage(trip.id)} 
                className="flex-1 md:flex-none bg-green-50 text-green-600 text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-green-100 transition border border-green-100 flex justify-center items-center gap-2 text-center"
            >
                <span>👥</span> Kelola
            </button>
            
            {/* Tombol Hapus */}
            <button 
                onClick={handleDelete} 
                disabled={isDeleting}
                className="flex-1 md:flex-none bg-red-50 text-red-600 text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-red-100 transition border border-red-100 flex justify-center items-center gap-2"
            >
                {isDeleting ? "..." : "🗑 Hapus"}
            </button>
        </div>
    </div>
  );
}