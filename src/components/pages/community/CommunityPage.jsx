"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast"; 
import FeedTripCard from "@/components/ui/card/FeedTripCard";
import MyTripCard from "@/components/ui/card/MyTripCard"; 
import JoinedTripCard from "@/components/ui/card/JoinedTripCard"; 
import GalleryGrid from "@/components/ui/section/community/GalleryGrid";
import CreateTripModal from "@/components/ui/modal/CreateTripModal";
import ManageParticipantsModal from "@/components/ui/modal/ManageParticipantsModal";
import TripDetailModal from "@/components/ui/modal/TripDetailModal";
import UploadGalleryModal from "@/components/ui/modal/UploadGalleryModal";

export default function CommunityPage({ data }) {
  const { feed: initialFeed, gallery: initialGallery } = data || {};
  
  const [user, setUser] = useState(null);
  const [feed, setFeed] = useState(initialFeed || []);
  const [gallery, setGallery] = useState(initialGallery || []);
  const [myTrips, setMyTrips] = useState([]);
  const [joinedTrips, setJoinedTrips] = useState([]);
  
  const [activePage, setActivePage] = useState("feed"); 
  const [activeTab, setActiveTab] = useState("feed");   
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); 
  
  const [tripToEdit, setTripToEdit] = useState(null);   
  const [tripToManage, setTripToManage] = useState(null); 
  const [selectedTrip, setSelectedTrip] = useState(null); 

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser) setUser(JSON.parse(storedUser));

    if (token) {
      loadMyTrips(token);
      loadJoinedTrips(token);
    }
    
    loadGallery(); 
  }, []);

  const loadMyTrips = (token) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/my-trips`, {
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(json => { if(json.data) setMyTrips(json.data); })
    .catch(err => console.error("Gagal load my trips", err));
  };

  const loadJoinedTrips = (token) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/joined-trips`, {
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(json => { if(json.data) setJoinedTrips(json.data); })
    .catch(err => console.error("Gagal load joined trips", err));
  };

  const loadGallery = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/galleries`)
    .then(res => res.json())
    .then(json => { if(json.data) setGallery(json.data); })
    .catch(err => console.error("Gagal load gallery", err));
  };

  // --- HANDLERS ---
  const handleCreateNew = () => {
    if (!user) return toast.error("Harap Login terlebih dahulu");
    setTripToEdit(null);
    setIsCreateModalOpen(true);
  };

  const handleUploadClick = () => {
    if (!user) return toast.error("Harap Login terlebih dahulu");
    setIsUploadModalOpen(true);
  };

  const handleEditTrip = (trip) => {
    setTripToEdit(trip);
    setIsCreateModalOpen(true);
  };

  const handleManageParticipants = (tripId) => {
    setTripToManage(tripId);
    setIsManageModalOpen(true);
  };

  const handleViewDetail = (trip) => {
    setSelectedTrip(trip);
    setIsDetailModalOpen(true);
  };

  const handleRefresh = () => {
    const token = localStorage.getItem("token");
    if(token) loadMyTrips(token);
    window.location.reload(); 
  };

  const handleJoinedRefresh = () => {
    const token = localStorage.getItem("token");
    if(token) loadJoinedTrips(token);
  };

  const handleGalleryRefresh = () => {
    loadGallery(); 
  };

  // --- KOMPONEN MENU ITEM (Biar rapi) ---
  const MenuItem = ({ pageId, icon, label, onClick }) => {
     const isActive = activePage === pageId;
     return (
        <button 
            onClick={onClick} 
            className={`
                whitespace-nowrap flex items-center gap-2 px-4 py-3 rounded-xl transition text-sm font-medium
                ${isActive 
                    ? 'bg-green-50 text-primary font-bold border-b-4 md:border-b-0 md:border-l-4 border-primary' 
                    : 'text-gray-500 hover:bg-gray-50'}
            `}
        >
            <span>{icon}</span> {label}
        </button>
     );
  };

  return (
    <div className="bg-bg-soft min-h-screen pb-20 font-sans text-gray-700">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">

            {/* --- 1. SIDEBAR DESKTOP / TOP MENU MOBILE --- */}
            {/* Di Mobile: Jadi Menu Horizontal Scrollable di atas */}
            {/* Di Desktop: Jadi Sidebar Vertikal di kiri */}
            <aside className="w-full md:w-1/4 space-y-4 md:space-y-6 md:sticky md:top-24 shrink-0">
                
                {/* Profile Card (Hanya muncul di Desktop, di Mobile sempit) */}
                <div className="hidden md:block bg-white p-6 rounded-2xl shadow-sm text-center border border-gray-100">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 overflow-hidden mb-4 border-4 border-gray-50">
                        <img 
                            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'Guest'}&background=random`} 
                            className="w-full h-full object-cover" 
                            alt="User"
                        />
                    </div>
                    <h3 className="font-bold text-base text-gray-900 line-clamp-1">{user?.name || "Tamu"}</h3>
                    <p className="text-xs text-gray-400 mb-4 line-clamp-1">{user?.email || "Yuk login dulu"}</p>
                    {user && (
                        <button className="text-xs font-bold text-primary border border-primary px-4 py-2 rounded-full hover:bg-primary hover:text-white transition w-full">
                            Edit Profil
                        </button>
                    )}
                </div>

                {/* MENU NAVIGASI UTAMA */}
                <div className="bg-white p-2 md:p-4 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 overflow-x-auto scrollbar-hide md:overflow-visible">
                    <div className="flex md:flex-col gap-1 md:gap-1 min-w-max md:min-w-0">
                        <MenuItem 
                            pageId="feed" 
                            icon="🏔" 
                            label="Feed Komunitas" 
                            onClick={() => setActivePage("feed")} 
                        />
                        <MenuItem 
                            pageId="mytrips" 
                            icon="🎫" 
                            label="Ajakan Saya" 
                            onClick={() => user ? setActivePage("mytrips") : toast.error("Harap Login terlebih dahulu")} 
                        />
                        <MenuItem 
                            pageId="joined" 
                            icon="🎒" 
                            label="Trip Diikuti" 
                            onClick={() => user ? setActivePage("joined") : toast.error("Harap Login terlebih dahulu")} 
                        />
                    </div>
                </div>
            </aside>


            {/* --- 2. KONTEN TENGAH --- */}
            <div className="flex-1 w-full min-w-0 space-y-6">

                {/* HALAMAN FEED */}
                {activePage === "feed" && (
                    <>
                        {/* Input Box: "Ada rencana muncak kemana?" */}
                        <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex gap-3 md:gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
                                     <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'G'}&background=random`} className="w-full h-full object-cover"/>
                                </div>
                                <div className="grow min-w-0">
                                    <div className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-500 mb-3 border border-transparent truncate">
                                        Halo {user?.name?.split(' ')[0] || 'Pendaki'}, ada rencana muncak?
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <button 
                                            onClick={handleUploadClick}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-2 rounded-lg hover:bg-green-50 hover:text-primary transition border border-gray-100"
                                        >
                                            📷 Upload Foto
                                        </button>
                                        
                                        <button 
                                            onClick={handleCreateNew}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-2 rounded-lg hover:bg-green-50 hover:text-primary transition border border-gray-100"
                                        >
                                            📅 Buat Ajakan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tab Switcher: Cari Barengan vs Galeri */}
                        <div className="bg-white rounded-xl shadow-sm flex text-sm font-medium overflow-hidden border border-gray-100 mb-6">
                            <button onClick={() => setActiveTab("feed")} className={`flex-1 py-3 text-center transition-colors ${activeTab === 'feed' ? 'border-b-4 border-primary text-primary font-bold bg-green-50/30' : 'text-gray-500 hover:bg-gray-50'}`}>
                                ⛺ Cari Barengan
                            </button>
                            <button onClick={() => setActiveTab("gallery")} className={`flex-1 py-3 text-center transition-colors ${activeTab === 'gallery' ? 'border-b-4 border-primary text-primary font-bold bg-green-50/30' : 'text-gray-500 hover:bg-gray-50'}`}>
                                📸 Galeri Momen
                            </button>
                        </div>

                        {/* Konten Tab */}
                        {activeTab === "feed" ? (
                            <div className="space-y-4 md:space-y-5">
                                <div className="flex justify-between items-center px-1">
                                    <h3 className="font-bold text-gray-800 text-lg">Ajakan Terbaru</h3>
                                </div>

                                {feed && feed.length > 0 ? (
                                    feed.map((trip) => (
                                        <FeedTripCard 
                                            key={trip.id} 
                                            trip={trip} 
                                            currentUser={user} 
                                            onDetail={handleViewDetail} 
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                                        <div className="text-4xl mb-3">⛺</div>
                                        <p className="text-gray-500 text-sm font-medium">Belum ada ajakan pendakian.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                                <GalleryGrid 
                                    gallery={gallery} 
                                    refreshData={loadGallery}
                                />
                            </div>
                        )}
                    </>
                )}

                {/* HALAMAN AJAKAN SAYA */}
                {activePage === "mytrips" && (
                    <div className="space-y-4 md:space-y-6 animate-in fade-in">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Manajemen Ajakan 🎫</h2>
                            <button onClick={handleCreateNew} className="bg-primary text-white text-xs md:text-sm font-bold px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-green-700 shadow-md transition">
                                + Buat Baru
                            </button>
                        </div>

                        {myTrips && myTrips.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {myTrips.map((trip) => (
                                    <MyTripCard 
                                        key={trip.id} 
                                        trip={trip} 
                                        onEdit={handleEditTrip}         
                                        onDeleteSuccess={handleRefresh} 
                                        onManage={() => handleManageParticipants(trip.id)} 
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 text-sm">Anda belum membuat ajakan pendakian.</p>
                                <button onClick={handleCreateNew} className="mt-4 text-primary font-bold text-sm hover:underline">
                                    Buat sekarang yuk!
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* HALAMAN TRIP DIIKUTI */}
                {activePage === "joined" && (
                    <div className="space-y-4 md:space-y-6 animate-in fade-in">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Rombongan Diikuti 🎒</h2>
                        
                        {joinedTrips && joinedTrips.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {joinedTrips.map((trip) => (
                                    <JoinedTripCard 
                                        key={trip.id} 
                                        trip={trip} 
                                        onLeaveSuccess={handleJoinedRefresh}
                                        onDetail={handleViewDetail} 
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 text-sm">Belum bergabung ke trip manapun.</p>
                                <button onClick={() => setActivePage("feed")} className="mt-4 text-primary font-bold text-sm hover:underline">
                                    Cari Barengan
                                </button>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>

        {/* MODAL POPUPS */}
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

        <TripDetailModal 
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            trip={selectedTrip}
            currentUser={user}
            onActionSuccess={handleRefresh}
        />

        <UploadGalleryModal 
            isOpen={isUploadModalOpen} 
            onClose={() => setIsUploadModalOpen(false)}
            onSuccess={handleGalleryRefresh}
        />

      </main>
    </div>
  );
}