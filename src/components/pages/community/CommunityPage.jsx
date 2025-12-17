"use client";
import { useState } from "react";
import FeedTripCard from "@/components/ui/card/FeedTripCard";
import MyTripCard from "@/components/ui/card/MyTripCard"; // Import Baru
import JoinedTripCard from "@/components/ui/card/JoinedTripCard"; // Import Baru
import GalleryGrid from "@/components/ui/section/community/GalleryGrid";

export default function CommunityPage({ data }) {
  // Ambil data myTrips dan joinedTrips juga (meskipun masih kosong dari API)
  const { feed, gallery, myTrips, joinedTrips } = data || {};
  
  const [activeTab, setActiveTab] = useState("feed");
  const [activePage, setActivePage] = useState("feed");

  return (
    <div className="bg-bg-soft min-h-screen pb-20 font-sans text-gray-700">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col md:flex-row gap-8 items-start">

            {/* --- SIDEBAR KIRI --- */}
            <aside className="hidden md:block w-full md:w-1/4 space-y-6 sticky top-24 shrink-0">
                <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] text-center border border-gray-100">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 overflow-hidden mb-4 border-4 border-gray-50">
                        <img src="https://ui-avatars.com/api/?name=Dimas+Anggara" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-bold text-base text-gray-900">Dimas Anggara</h3>
                    <button className="mt-4 text-xs font-bold text-primary border border-primary px-4 py-2 rounded-full hover:bg-primary hover:text-white transition w-full">
                        Edit Profil
                    </button>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 space-y-1">
                    <button onClick={() => setActivePage("feed")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm ${activePage === 'feed' ? 'bg-green-50 text-primary font-bold border-l-4 border-primary' : 'text-gray-500 hover:bg-gray-50 font-medium'}`}>
                        <span>🏔</span> Feed Komunitas
                    </button>
                    
                    <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Trip Management</div>

                    <button onClick={() => setActivePage("mytrips")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm ${activePage === 'mytrips' ? 'bg-green-50 text-primary font-bold border-l-4 border-primary' : 'text-gray-500 hover:bg-gray-50 font-medium'}`}>
                        <span>🎫</span> Ajakan Saya
                    </button>
                    
                    <button onClick={() => setActivePage("joined")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm ${activePage === 'joined' ? 'bg-blue-50 text-blue-600 font-bold border-l-4 border-blue-500' : 'text-gray-500 hover:bg-gray-50 font-medium'}`}>
                        <span>🎒</span> Trip Diikuti
                    </button>
                </div>

                <div className="text-[10px] text-gray-400 text-center px-4">
                    <p>&copy; 2025 JejakKaki Project.</p>
                </div>
            </aside>

            {/* --- KONTEN TENGAH --- */}
            <div className="flex-1 w-full min-w-0 space-y-6">

                {/* 1. TAMPILAN FEED UTAMA */}
                {activePage === "feed" && (
                    <>
                        {/* Input Bar */}
                        <div className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 shrink-0 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
                                     <img src="https://ui-avatars.com/api/?name=Dimas+Anggara" className="w-full h-full object-cover"/>
                                </div>
                                <div className="grow min-w-0">
                                    <input type="text" placeholder="Cari teman nanjak..." className="w-full bg-gray-50 rounded-xl px-5 py-3 text-sm outline-none cursor-pointer hover:bg-gray-100 transition mb-3 border border-transparent focus:bg-white focus:border-green-100" />
                                    <div className="flex flex-wrap justify-between items-center gap-2">
                                        <div className="flex gap-2">
                                            <button className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-2 rounded-lg hover:bg-green-50 hover:text-primary transition">📷 Foto</button>
                                            <button className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-2 rounded-lg hover:bg-green-50 hover:text-primary transition">📅 Buat Ajakan</button>
                                        </div>
                                        <button className="bg-primary text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-green-700 shadow-md transition">Posting</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tab Switcher */}
                        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex text-sm font-medium overflow-hidden border border-gray-100">
                            <button onClick={() => setActiveTab("feed")} className={`flex-1 py-3 text-center transition-colors ${activeTab === 'feed' ? 'border-b-4 border-primary text-primary font-bold bg-green-50/30' : 'text-gray-500 hover:bg-gray-50'}`}>⛺ Cari Barengan</button>
                            <button onClick={() => setActiveTab("gallery")} className={`flex-1 py-3 text-center transition-colors ${activeTab === 'gallery' ? 'border-b-4 border-primary text-primary font-bold bg-green-50/30' : 'text-gray-500 hover:bg-gray-50'}`}>📸 Galeri Momen</button>
                        </div>

                        {/* Konten Feed / Galeri */}
                        {activeTab === "feed" ? (
                            <div className="space-y-5">
                                {feed && feed.length > 0 ? (
                                    feed.map((trip) => <FeedTripCard key={trip.id} trip={trip} />)
                                ) : (
                                    <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                                        <div className="text-4xl mb-3">⛺</div>
                                        <p className="text-gray-500 text-sm font-medium">Belum ada ajakan pendakian.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100">
                                <GalleryGrid gallery={gallery} />
                            </div>
                        )}
                    </>
                )}

                {/* 2. TAMPILAN AJAKAN SAYA (MyTrips) */}
                {activePage === "mytrips" && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-2xl font-bold text-gray-900">Manajemen Ajakan 🎫</h2>
                            <button className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-green-700 shadow-md transition">
                                + Buat Baru
                            </button>
                        </div>

                        {myTrips && myTrips.length > 0 ? (
                            myTrips.map((trip) => <MyTripCard key={trip.id} trip={trip} />)
                        ) : (
                            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 text-sm">Anda belum membuat ajakan pendakian.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* 3. TAMPILAN TRIP DIIKUTI (JoinedTrips) */}
                {activePage === "joined" && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Rombongan Diikuti 🎒</h2>
                        
                        {joinedTrips && joinedTrips.length > 0 ? (
                            joinedTrips.map((trip) => <JoinedTripCard key={trip.id} trip={trip} />)
                        ) : (
                            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 text-sm">Anda belum bergabung ke trip manapun.</p>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
      </main>
    </div>
  );
}