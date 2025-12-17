"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function TripDetailPage({ params }) {
  // Unwrapping params (Next.js 15 requirement)
  const { id } = use(params);
  const router = useRouter();
  
  const [trip, setTrip] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  // 1. Fetch Data Trip
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchTrip = async () => {
      try {
        const token = localStorage.getItem("token");
        // Kita gunakan endpoint public/detail jika ada, atau endpoint participants (karena isinya lengkap)
        // Atau buat endpoint show public di backend.
        // Untuk amannya kita pakai endpoint participants yang sudah kita buat sebelumnya karena return data trip lengkap
        const res = await fetch(`http://127.0.0.1:8000/api/open-trips/${id}/participants`, {
             headers: token ? { "Authorization": `Bearer ${token}` } : {}
        });
        
        if (!res.ok) throw new Error("Trip tidak ditemukan");
        const json = await res.json();
        setTrip(json.data);
      } catch (error) {
        console.error(error);
        toast.error("Gagal memuat data trip");
        router.push("/komunitas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrip();
  }, [id, router]);

  // Logic Cek Status User
  const isOwner = user && trip && parseInt(trip.user_id) === parseInt(user.id);
  const isJoined = user && trip && trip.participants?.some(p => parseInt(p.id) === parseInt(user.id));
  const remainingSlots = trip ? trip.max_participants - (trip.participants?.length || 0) : 0;

  // Format Tanggal
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", { 
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
    });
  };

  // Handler Gabung
  const handleJoin = async () => {
    if (!user) return router.push("/login");
    setIsJoining(true);
    const toastId = toast.loading("Bergabung...");
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://127.0.0.1:8000/api/open-trips/${id}/join`, {
            method: "POST", headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        toast.success("Berhasil gabung!", { id: toastId });
        window.location.reload();
    } catch (e) { toast.error(e.message, { id: toastId }); } 
    finally { setIsJoining(false); }
  };

  // Handler Keluar
  const handleLeave = async () => {
    if(!confirm("Yakin ingin keluar dari trip ini?")) return;
    setIsJoining(true);
    const toastId = toast.loading("Keluar trip...");
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://127.0.0.1:8000/api/open-trips/${id}/leave`, {
            method: "POST", headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        toast.success("Berhasil keluar", { id: toastId });
        window.location.reload();
    } catch (e) { toast.error(e.message, { id: toastId }); } 
    finally { setIsJoining(false); }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Memuat detail trip...</div>;
  if (!trip) return null;

  return (
    <div className="min-h-screen bg-bg-soft py-8 px-4 font-sans text-gray-700">
        <div className="max-w-4xl mx-auto">
            
            {/* Tombol Kembali */}
            <button onClick={() => router.back()} className="mb-6 text-sm font-bold text-gray-500 hover:text-primary flex items-center gap-2">
                ← Kembali ke Komunitas
            </button>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                
                {/* HEADER BANNER */}
                <div className="bg-green-50 p-8 border-b border-green-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <span className="bg-white text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200 uppercase tracking-wide">
                                {trip.status === 'open' ? 'Open Trip' : 'Full / Selesai'}
                            </span>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3 mb-2">{trip.title}</h1>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>📍 {trip.hiking_trail?.name}</span>
                                <span>•</span>
                                <span>📅 {formatDate(trip.trip_date)}</span>
                            </div>
                        </div>
                        
                        {/* Box Leader */}
                        <div className="bg-white p-3 rounded-xl border border-green-100 flex items-center gap-3 shadow-sm">
                            <img src={trip.user?.avatar || `https://ui-avatars.com/api/?name=${trip.user?.name}`} className="w-10 h-10 rounded-full bg-gray-200" />
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Trip Leader</p>
                                <p className="text-sm font-bold text-gray-800">{trip.user?.name}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3">
                    
                    {/* KIRI: Detail Info */}
                    <div className="md:col-span-2 p-8 border-r border-gray-100">
                        <h3 className="font-bold text-lg text-gray-900 mb-4">Detail Rencana</h3>
                        <div className="prose prose-sm text-gray-600 mb-8 whitespace-pre-wrap leading-relaxed">
                            {trip.description}
                        </div>

                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500 font-bold">Meeting Point</span>
                                <span className="text-sm text-gray-900 font-bold">{trip.meeting_point}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500 font-bold">Slot Tersedia</span>
                                <span className={`text-sm font-bold ${remainingSlots > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {remainingSlots} / {trip.max_participants} Kursi
                                </span>
                            </div>
                            {/* Tampilkan Link Grup Chat HANYA jika sudah join atau owner */}
                            {(isJoined || isOwner) && (
                                <div className="pt-3 border-t border-gray-200 mt-3">
                                    <p className="text-xs text-gray-500 mb-1">Link Grup WhatsApp (Privat):</p>
                                    <a href={trip.group_chat_link} target="_blank" className="text-blue-600 font-bold text-sm hover:underline break-all">
                                        {trip.group_chat_link}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* KANAN: Peserta & Aksi */}
                    <div className="p-8 bg-gray-50/30">
                        <h3 className="font-bold text-gray-900 mb-4 flex justify-between items-center">
                            Peserta
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">{trip.participants?.length || 0}</span>
                        </h3>
                        
                        <div className="space-y-3 mb-8 max-h-60 overflow-y-auto custom-scrollbar">
                            {trip.participants?.map((p) => (
                                <div key={p.id} className="flex items-center gap-3">
                                    <img src={p.avatar || `https://ui-avatars.com/api/?name=${p.name}`} className="w-8 h-8 rounded-full bg-gray-200" />
                                    <span className="text-sm font-medium text-gray-700 truncate">{p.name}</span>
                                    {parseInt(p.id) === parseInt(trip.user_id) && (
                                        <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold ml-auto">Leader</span>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* TOMBOL AKSI */}
                        <div className="mt-auto">
                            {isOwner ? (
                                <button disabled className="w-full bg-gray-200 text-gray-500 font-bold py-3 rounded-xl cursor-default text-sm">
                                    Ini Trip Anda
                                </button>
                            ) : isJoined ? (
                                <button 
                                    onClick={handleLeave} 
                                    disabled={isJoining}
                                    className="w-full bg-white border border-red-200 text-red-500 font-bold py-3 rounded-xl hover:bg-red-50 transition text-sm shadow-sm"
                                >
                                    {isJoining ? "..." : "Keluar Trip"}
                                </button>
                            ) : remainingSlots > 0 ? (
                                <button 
                                    onClick={handleJoin} 
                                    disabled={isJoining}
                                    className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition text-sm shadow-lg shadow-green-200"
                                >
                                    {isJoining ? "..." : "Gabung Sekarang"}
                                </button>
                            ) : (
                                <button disabled className="w-full bg-red-100 text-red-500 font-bold py-3 rounded-xl cursor-not-allowed text-sm">
                                    Slot Penuh
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}