"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function ManageParticipantsModal({ isOpen, onClose, tripId }) {
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi Fetch Data (Dipisah agar bisa dipanggil ulang setelah delete)
  const fetchParticipants = () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/open-trips/${tripId}/participants`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(json => {
      setTrip(json.data);
      setIsLoading(false);
    })
    .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    if (isOpen && tripId) {
      fetchParticipants();
    }
  }, [isOpen, tripId]);

  // FUNGSI KICK MEMBER
  const handleKick = async (userId, userName) => {
    if(!confirm(`Yakin ingin menghapus ${userName} dari trip ini?`)) return;
    
    const toastId = toast.loading("Menghapus peserta...");
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/open-trips/${tripId}/participants/${userId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Gagal menghapus");
        
        toast.success("Peserta dihapus", { id: toastId });
        fetchParticipants(); // Refresh list tanpa tutup modal

    } catch (error) {
        toast.error("Gagal menghapus", { id: toastId });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
        
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="text-lg font-bold text-gray-900">👥 Kelola Peserta</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-red-500 font-bold text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar bg-white">
            {isLoading && !trip ? (
                <div className="text-center py-8 text-gray-400">Memuat data...</div>
            ) : trip ? (
                <>
                    <div className="bg-green-50 p-4 rounded-xl text-center mb-6 border border-green-100">
                        <p className="text-xs font-bold text-gray-500 uppercase">Total Peserta</p>
                        <p className="text-2xl font-bold text-green-700">
                            {trip.participants ? trip.participants.length : 0} 
                            <span className="text-sm text-gray-400 font-normal"> / {trip.max_participants} Slot</span>
                        </p>
                    </div>

                    <div className="space-y-3">
                        {trip.participants && trip.participants.length > 0 ? (
                            trip.participants.map((p) => (
                                <div key={p.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition group">
                                    <img src={p.avatar || `https://ui-avatars.com/api/?name=${p.name}`} className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-900">{p.name}</p>
                                        <p className="text-xs text-gray-500">{p.email}</p>
                                    </div>
                                    
                                    {/* TOMBOL DELETE (Hanya muncul saat hover di desktop, atau selalu ada di mobile) */}
                                    <button 
                                        onClick={() => handleKick(p.id, p.name)}
                                        className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-sm text-gray-400 py-4 italic">Belum ada peserta.</p>
                        )}
                    </div>
                </>
            ) : null}
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50 text-right">
             <button onClick={onClose} className="bg-gray-200 text-gray-700 font-bold px-6 py-2 rounded-lg text-sm hover:bg-gray-300">Tutup</button>
        </div>
      </div>
    </div>
  );
}