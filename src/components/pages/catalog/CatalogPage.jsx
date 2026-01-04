"use client";

import { useState, useMemo, useEffect } from "react";
import MountainCard from "@/components/ui/card/MountainCard";

// --- KOMPONEN IKON SEDERHANA ---
const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default function CatalogPage({ mountains }) {
  // --- STATE ---
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const [filterDifficulty, setFilterDifficulty] = useState("all"); 
  const [filterGuide, setFilterGuide] = useState("all"); 
  const [sortBy, setSortBy] = useState("populer"); 

  // Kontrol Filter Mobile
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // --- LOGIC DEBOUNCE ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // --- LOGIC FILTERING ---
  const filteredMountains = useMemo(() => {
    let result = [...mountains];

    // 1. Filter Search
    if (debouncedSearch) {
      const lowerSearch = debouncedSearch.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(lowerSearch) ||
          m.location.toLowerCase().includes(lowerSearch)
      );
    }

    // 2. Filter Difficulty
    if (filterDifficulty !== "all") {
      result = result.filter((m) => m.difficulty_level === filterDifficulty);
    }

    // 3. Filter Guide
    if (filterGuide !== "all") {
      const isRequired = filterGuide === "required"; 
      result = result.filter((m) => Boolean(m.is_guide_required) === isRequired);
    }

    // 4. Sorting
    switch (sortBy) {
      case "termurah":
        result.sort((a, b) => a.ticket_price - b.ticket_price);
        break;
      case "rating":
        result.sort((a, b) => (b.reviews_avg_rating || 0) - (a.reviews_avg_rating || 0));
        break;
      case "tertinggi":
        result.sort((a, b) => b.elevation - a.elevation);
        break;
      case "populer":
      default:
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }

    return result;
  }, [mountains, debouncedSearch, filterDifficulty, filterGuide, sortBy]);

  // --- RESET HANDLER ---
  const handleReset = () => {
    setSearch("");
    setDebouncedSearch("");
    setFilterDifficulty("all");
    setFilterGuide("all");
    setSortBy("populer");
    setIsMobileFilterOpen(false);
  };

  // --- REUSABLE FILTER COMPONENT (Isi Filter) ---
  // Menerima prop 'mode' agar atribut 'name' pada radio button unik
  const FilterContent = ({ mode }) => (
    <>
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 text-lg">Filter</h3>
            <button onClick={handleReset} className="text-xs text-secondary font-medium hover:underline">Reset Semua</button>
        </div>

        {/* FILTER 1: TINGKAT KESULITAN */}
        <div className="mb-6">
            <h4 className="text-sm font-bold text-gray-800 mb-3">Tingkat Kesulitan</h4>
            <div className="flex flex-wrap gap-2">
                {['easy', 'medium', 'hard'].map((level) => (
                    <button 
                        key={level}
                        onClick={() => setFilterDifficulty(filterDifficulty === level ? 'all' : level)}
                        className={`text-xs px-3 py-2 rounded-lg transition font-bold capitalize border ${
                            filterDifficulty === level 
                            ? 'bg-primary text-white border-primary shadow-md' 
                            : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-primary hover:text-primary'
                        }`}
                    >
                        {level}
                    </button>
                ))}
            </div>
        </div>

        {/* FILTER 2: GUIDE (Fixed Name Collision) */}
        <div className="mb-4">
            <h4 className="text-sm font-bold text-gray-800 mb-3">Ketentuan Guide</h4>
            <div className="space-y-3 text-sm text-gray-600">
                {[
                    { val: 'all', label: 'Semua' },
                    { val: 'not_required', label: 'Bebas (Tanpa Guide)' },
                    { val: 'required', label: 'Wajib Guide' }
                ].map((option) => (
                    <label 
                        key={option.val}
                        className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition border ${
                            filterGuide === option.val 
                            ? 'bg-green-50 border-primary text-primary font-bold' 
                            : 'border-transparent hover:bg-gray-50 hover:border-gray-100'
                        }`}
                    >
                        <input 
                            type="radio" 
                            // KUNCI PERBAIKAN: Tambahkan suffix mode agar unik
                            name={`guide_${mode}`} 
                            className="accent-primary w-4 h-4 shrink-0" 
                            checked={filterGuide === option.val}
                            onChange={() => setFilterGuide(option.val)}
                        /> 
                        {option.label}
                    </label>
                ))}
            </div>
        </div>
    </>
  );

  return (
    <div className="bg-bg-soft min-h-screen pb-20 font-sans text-gray-700">
        
        {/* --- HEADER PENCARIAN --- */}
        <header className="bg-primary relative overflow-hidden h-auto py-8 md:h-56 flex items-center">
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-white text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold mb-1">Jelajahi Jalur</h1>
                    <p className="text-green-100 text-sm">Temukan destinasi pendakian terbaik di Bali</p>
                </div>
                
                <div className="bg-white p-1.5 rounded-xl flex w-full md:w-96 shadow-lg">
                    <input 
                        type="text" 
                        placeholder="Cari nama gunung..." 
                        className="flex-1 px-4 outline-none text-sm font-medium rounded-l-lg text-gray-700 min-w-0"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="bg-secondary text-white px-4 md:px-6 py-2 rounded-lg text-sm font-bold hover:bg-orange-600 transition flex items-center justify-center">
                        {search !== debouncedSearch ? "..." : "🔍"}
                    </button>
                </div>
            </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 flex flex-col lg:flex-row gap-8 relative">
            
            {/* --- 1. SIDEBAR FILTER DESKTOP --- */}
            {/* Hanya muncul di layar besar (lg:block) */}
            <aside className="hidden lg:block w-1/4 space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
                   {/* Pass mode 'desktop' */}
                   <FilterContent mode="desktop" />
                </div>
            </aside>

            {/* --- 2. MODAL FILTER MOBILE --- */}
            {/* Overlay Gelap */}
            {isMobileFilterOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity"
                    onClick={() => setIsMobileFilterOpen(false)}
                ></div>
            )}
            
            {/* Panel Putih (Slide dari Bawah) */}
            <div className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl p-6 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden max-h-[85vh] overflow-y-auto ${isMobileFilterOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                {/* Handle Bar */}
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
                
                {/* Tombol Close */}
                <button 
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"
                >
                    <CloseIcon />
                </button>

                {/* Pass mode 'mobile' */}
                <FilterContent mode="mobile" />
                
                <button 
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl mt-6 shadow-lg hover:bg-green-700"
                >
                    Terapkan Filter ({filteredMountains.length})
                </button>
            </div>


            {/* --- 3. LIST GUNUNG --- */}
            <section className="w-full lg:w-3/4">
                
                {/* Control Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    
                    {/* Tombol Filter Mobile & Counter */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button 
                            onClick={() => setIsMobileFilterOpen(true)}
                            className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm flex-1 sm:flex-none justify-center transition hover:bg-gray-50"
                        >
                            <FilterIcon /> 
                            Filter
                            {(filterDifficulty !== 'all' || filterGuide !== 'all') && (
                                <span className="bg-secondary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">!</span>
                            )}
                        </button>
                        
                        <p className="text-sm text-gray-500 hidden sm:block">
                            Menampilkan <span className="font-bold text-gray-800">{filteredMountains.length}</span> jalur
                        </p>
                    </div>

                    {/* Sorting Dropdown */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <span className="text-sm text-gray-500 whitespace-nowrap">Urutkan:</span>
                        <div className="relative flex-1 sm:flex-none">
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full sm:w-auto appearance-none text-sm font-bold bg-white border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 outline-none focus:border-primary cursor-pointer shadow-sm text-gray-700"
                            >
                                <option value="populer">Paling Baru</option>
                                <option value="termurah">Harga Termurah</option>
                                <option value="rating">Rating Tertinggi</option>
                                <option value="tertinggi">Mdpl Tertinggi</option>
                            </select>
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Counter Mobile (Dipisah biar rapi) */}
                <p className="text-xs text-gray-500 sm:hidden mb-4">
                     Menampilkan <span className="font-bold text-gray-800">{filteredMountains.length}</span> jalur pendakian
                </p>

                {/* Grid Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-in fade-in">
                    {filteredMountains.length > 0 ? (
                        filteredMountains.map((mountain) => (
                            <MountainCard key={mountain.id} mountain={mountain} />
                        ))
                    ) : (
                        <div className="col-span-3 py-16 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white">
                            <div className="text-4xl mb-3">🔍</div>
                            <p className="text-gray-500 font-medium">Tidak ada gunung yang cocok.</p>
                            <button onClick={handleReset} className="text-primary text-sm font-bold hover:underline mt-2">Reset Filter</button>
                        </div>
                    )}
                </div>

            </section>
        </main>
    </div>
  );
}