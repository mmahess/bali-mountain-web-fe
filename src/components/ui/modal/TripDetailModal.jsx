"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function TripDetailModal({ isOpen, onClose, trip, currentUser, onActionSuccess }) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !trip) return null;

  // Cek Status User terhadap Trip ini
  const isOwner = currentUser && parseInt(trip.user_id) === parseInt(currentUser.id);
  const isJoined = trip.participants?.some(p => parseInt(p.id) === parseInt(currentUser?.id));
  const remainingSlots = trip.max_participants - (trip.participants_count || 0);

  // Format Tanggal
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", { 
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
    });
  };

  // --- ACTIONS ---
  const handleJoin = async () => {
    if (!currentUser) return toast.error("Silakan login dulu");
    setIsLoading(true);
    const toastId = toast.loading("Bergabung...");
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://127.0.0.1:8000/api/open-trips/${trip.id}/join`, {
            method: "POST", headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        
        toast.success("Berhasil gabung!", { id: toastId });
        onActionSuccess(); // Refresh data di halaman utama
        onClose();         // Tutup modal
    } catch (e) { toast.error(e.message, { id: toastId }); } 
    finally { setIsLoading(false); }
  };

  const handleLeave = async () => {
    if(!confirm("Yakin ingin keluar dari trip ini?")) return;
    setIsLoading(true);
    const toastId = toast.loading("Keluar trip...");
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://127.0.0.1:8000/api/open-trips/${trip.id}/leave`, {
            method: "POST", headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        toast.success("Berhasil keluar", { id: toastId });
        onActionSuccess(); 
        onClose();
    } catch (e) { toast.error(e.message, { id: toastId }); } 
    finally { setIsLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
            <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase mb-2 inline-block ${remainingSlots > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {remainingSlots > 0 ? 'Open Trip' : 'Full / Selesai'}
                </span>
                <h2 className="text-xl font-bold text-gray-900 leading-tight">{trip.title}</h2>
                <p className="text-sm text-gray-500 mt-1">📍 {trip.hiking_trail?.name}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-red-500 font-bold text-2xl leading-none">&times;</button>
        </div>

        {/* BODY (Scrollable) */}
        <div className="p-6 overflow-y-auto custom-scrollbar bg-white">
            
            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Tanggal</p>
                    <p className="text-sm font-bold text-gray-800">{formatDate(trip.trip_date)}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Meeting Point</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{trip.meeting_point}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Peserta</p>
                    <p className="text-sm font-bold text-gray-800">{trip.participants_count} / {trip.max_participants}</p>
                </div>
            </div>

            {/* Deskripsi */}
            <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-2 text-sm">Detail Rencana</h3>
                <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {trip.description}
                </div>
            </div>

            {/* Link Grup (Hanya jika member/owner) */}
            {(isJoined || isOwner) && trip.group_chat_link && (
                <div className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-2 text-sm">Grup Komunikasi</h3>
                    <a href={trip.group_chat_link} target="_blank" className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 hover:bg-green-100 transition">
                        <span className="text-xl">💬</span>
                        <div>
                            <p className="text-xs font-bold uppercase opacity-70">WhatsApp Group</p>
                            <p className="text-sm font-bold truncate">{trip.group_chat_link}</p>
                        </div>
                    </a>
                </div>
            )}

            {/* List Peserta */}
            <div>
                <h3 className="font-bold text-gray-800 mb-3 text-sm flex justify-between">
                    Daftar Peserta <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">{trip.participants?.length || 0}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-2 pr-3 py-1 pl-1 bg-yellow-50 border border-yellow-200 rounded-full">
                        <img src={trip.user?.avatar || `https://ui-avatars.com/api/?name=${trip.user?.name}`} className="w-6 h-6 rounded-full" />
                        <span className="text-xs font-bold text-yellow-800">{trip.user?.name} (Leader)</span>
                    </div>
                    {trip.participants?.filter(p => p.id !== trip.user_id).map((p) => (
                         <div key={p.id} className="flex items-center gap-2 pr-3 py-1 pl-1 bg-gray-50 border border-gray-200 rounded-full">
                            <img src={p.avatar || `https://ui-avatars.com/api/?name=${p.name}`} className="w-6 h-6 rounded-full" />
                            <span className="text-xs font-bold text-gray-600">{p.name}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>

        {/* FOOTER ACTION */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-200">
                Tutup
            </button>

            {isOwner ? (
                <button disabled className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gray-200 text-gray-500 cursor-default">
                    Ini Trip Anda
                </button>
            ) : isJoined ? (
                <button onClick={handleLeave} disabled={isLoading} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-red-50 text-red-600 border border-red-200 hover:bg-red-100">
                    {isLoading ? "..." : "Keluar Trip"}
                </button>
            ) : remainingSlots > 0 ? (
                <button onClick={handleJoin} disabled={isLoading} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200">
                    {isLoading ? "..." : "Gabung Sekarang"}
                </button>
            ) : (
                <button disabled className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gray-300 text-white cursor-not-allowed">
                    Penuh
                </button>
            )}
        </div>

      </div>
    </div>
  );
}