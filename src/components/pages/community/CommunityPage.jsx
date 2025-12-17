"use client";

import { useState, useEffect } from "react";
import FeedTripCard from "@/components/ui/card/FeedTripCard";
import MyTripCard from "@/components/ui/card/MyTripCard"; 
import JoinedTripCard from "@/components/ui/card/JoinedTripCard"; 
import GalleryGrid from "@/components/ui/section/community/GalleryGrid";
import CreateTripModal from "@/components/ui/modal/CreateTripModal";
import ManageParticipantsModal from "@/components/ui/modal/ManageParticipantsModal";
import TripDetailModal from "@/components/ui/modal/TripDetailModal"; // Modal Baru

export default function CommunityPage({ data }) {
  const { feed, gallery } = data || {};
  
  // --- STATE DATA ---
  const [user, setUser] = useState(null);
  const [myTrips, setMyTrips] = useState([]);
  const [joinedTrips, setJoinedTrips] = useState([]);
  
  // --- STATE UI ---
  const [activePage, setActivePage] = useState("feed"); // 'feed' | 'mytrips' | 'joined'
  const [activeTab, setActiveTab] = useState("feed");   // 'feed' | 'gallery'
  
  // --- STATE MODALS ---
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // State Modal Detail
  
  const [tripToEdit, setTripToEdit] = useState(null);   
  const [tripToManage, setTripToManage] = useState(null); 
  const [selectedTrip, setSelectedTrip] = useState(null); // Trip yang diklik untuk detail

  // --- LOAD DATA ---
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser) setUser(JSON.parse(storedUser));

    if (token) {
      loadMyTrips(token);
      loadJoinedTrips(token);
    }
  }, []);

  const loadMyTrips = (token) => {
    fetch("http://127.0.0.1:8000/api/my-trips", {
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(json => { if(json.data) setMyTrips(json.data); })
    .catch(err => console.error("Gagal load my trips", err));
  };

  const loadJoinedTrips = (token) => {
    fetch("http://127.0.0.1:8000/api/joined-trips", {
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(json => { if(json.data) setJoinedTrips(json.data); })
    .catch(err => console.error("Gagal load joined trips", err));
  };

  // --- HANDLERS ---
  const handleCreateNew = () => {
    setTripToEdit(null);
    setIsCreateModalOpen(true);
  };

  const handleEditTrip = (trip) => {
    setTripToEdit(trip);
    setIsCreateModalOpen(true);
  };

  const handleManageParticipants = (tripId) => {
    setTripToManage(tripId);
    setIsManageModalOpen(true);
  };

  // Handler Buka Detail
  const handleViewDetail = (trip) => {
    setSelectedTrip(trip);
    setIsDetailModalOpen(true);
  };

  // Refresh
  const handleRefresh = () => {
    const token = localStorage.getItem("token");
    if(token) loadMyTrips(token);
    window.location.reload(); 
  };

  const handleJoinedRefresh = () => {
    const token = localStorage.getItem("token");
    if(token) loadJoinedTrips(token);
    // window.location.reload(); // Opsional jika ingin update feed realtime
  };

  return (
    <div className="bg-bg-soft min-h-screen pb-20 font-sans text-gray-700">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col md:flex-row gap-8 items-start">

            {/* SIDEBAR */}
            <aside className="hidden md:block w-full md:w-1/4 space-y-6 sticky top-24 shrink-0">
                <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] text-center border border-gray-100">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 overflow-hidden mb-4 border-4 border-gray-50">
                        <img 
                            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'Guest'}&background=random`} 
                            className="w-full h-full object-cover" 
                            alt="User"
                        />
                    </div>
                    <h3 className="font-bold text-base text-gray-900">{user?.name || "Tamu"}</h3>
                    <p className="text-xs text-gray-400 mb-4">{user?.email}</p>
                    <button className="text-xs font-bold text-primary border border-primary px-4 py-2 rounded-full hover:bg-primary hover:text-white transition w-full">Edit Profil</button>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 space-y-1">
                    <button onClick={() => setActivePage("feed")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm ${activePage === 'feed' ? 'bg-green-50 text-primary font-bold border-l-4 border-primary' : 'text-gray-500 hover:bg-gray-50 font-medium'}`}>
                        <span>🏔</span> Feed Komunitas
                    </button>
                    <button onClick={() => setActivePage("mytrips")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm ${activePage === 'mytrips' ? 'bg-green-50 text-primary font-bold border-l-4 border-primary' : 'text-gray-500 hover:bg-gray-50 font-medium'}`}>
                        <span>🎫</span> Ajakan Saya
                    </button>
                    <button onClick={() => setActivePage("joined")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm ${activePage === 'joined' ? 'bg-blue-50 text-blue-600 font-bold border-l-4 border-blue-500' : 'text-gray-500 hover:bg-gray-50 font-medium'}`}>
                        <span>🎒</span> Trip Diikuti
                    </button>
                </div>
            </aside>

            {/* KONTEN UTAMA */}
            <div className="flex-1 w-full min-w-0 space-y-6">

                {/* 1. FEED */}
                {activePage === "feed" && (
                    <>
                        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex text-sm font-medium overflow-hidden border border-gray-100 mb-6">
                            <button onClick={() => setActiveTab("feed")} className={`flex-1 py-3 text-center transition-colors ${activeTab === 'feed' ? 'border-b-4 border-primary text-primary font-bold bg-green-50/30' : 'text-gray-500 hover:bg-gray-50'}`}>⛺ Cari Barengan</button>
                            <button onClick={() => setActiveTab("gallery")} className={`flex-1 py-3 text-center transition-colors ${activeTab === 'gallery' ? 'border-b-4 border-primary text-primary font-bold bg-green-50/30' : 'text-gray-500 hover:bg-gray-50'}`}>📸 Galeri Momen</button>
                        </div>

                        {activeTab === "feed" ? (
                            <div className="space-y-5">
                                <div className="flex justify-between items-center px-2">
                                    <h3 className="font-bold text-gray-800">Ajakan Terbaru</h3>
                                    <button onClick={handleCreateNew} className="text-primary text-xs font-bold hover:underline">+ Buat Ajakan</button>
                                </div>
                                {feed && feed.length > 0 ? (
                                    feed.map((trip) => (
                                        <FeedTripCard 
                                            key={trip.id} 
                                            trip={trip} 
                                            currentUser={user} 
                                            onDetail={handleViewDetail} // <--- Pass Handler
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200"><p className="text-gray-500 text-sm">Belum ada ajakan.</p></div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100">
                                <GalleryGrid gallery={gallery} />
                            </div>
                        )}
                    </>
                )}

                {/* 2. MY TRIPS */}
                {activePage === "mytrips" && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-2xl font-bold text-gray-900">Manajemen Ajakan 🎫</h2>
                            <button onClick={handleCreateNew} className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-green-700 shadow-md transition">+ Buat Baru</button>
                        </div>
                        {myTrips && myTrips.length > 0 ? (
                            myTrips.map((trip) => (
                                <MyTripCard 
                                    key={trip.id} 
                                    trip={trip} 
                                    onEdit={handleEditTrip}         
                                    onDeleteSuccess={handleRefresh} 
                                    onManage={() => handleManageParticipants(trip.id)} 
                                />
                            ))
                        ) : (
                            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200"><p className="text-gray-400 text-sm">Belum ada ajakan.</p></div>
                        )}
                    </div>
                )}

                {/* 3. JOINED TRIPS */}
                {activePage === "joined" && (
                    <div className="space-y-6 animate-in fade-in">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Rombongan Diikuti 🎒</h2>
                        {joinedTrips && joinedTrips.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {joinedTrips.map((trip) => (
                                    <JoinedTripCard 
                                        key={trip.id} 
                                        trip={trip} 
                                        onLeaveSuccess={handleJoinedRefresh}
                                        onDetail={handleViewDetail} // <--- Pass Handler
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 text-sm">Belum bergabung ke trip manapun.</p>
                                <button onClick={() => setActivePage("feed")} className="mt-4 text-primary font-bold text-sm hover:underline">Cari Barengan</button>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>

        {/* --- MODALS --- */}
        <CreateTripModal 
            isOpen={isCreateModalOpen} 
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={handleRefresh}
            tripToEdit={tripToEdit}
        />

        <ManageParticipantsModal 
            isOpen={isManageModalOpen} 
            onClose={() => setIsManageModalOpen(false)}
            tripId={tripToManage}
        />

        {/* MODAL DETAIL BARU */}
        <TripDetailModal 
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            trip={selectedTrip}
            currentUser={user}
            onActionSuccess={handleRefresh}
        />

      </main>
    </div>
  );
}