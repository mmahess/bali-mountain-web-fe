"use client";

import { useState, useMemo, useEffect } from "react";
import MountainCard from "@/components/ui/card/MountainCard";

export default function CatalogPage({ mountains }) {
  // --- STATE ---
  const [search, setSearch] = useState(""); // Nilai input langsung (real-time)
  const [debouncedSearch, setDebouncedSearch] = useState(""); // Nilai pencarian tertunda
  
  const [filterDifficulty, setFilterDifficulty] = useState("all"); 
  const [filterGuide, setFilterGuide] = useState("all"); 
  const [sortBy, setSortBy] = useState("populer"); 

  // --- LOGIC DEBOUNCE (Penunda Pencarian) ---
  useEffect(() => {
    // Set timer untuk update 'debouncedSearch' setelah 500ms (0.5 detik)
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);

    // Bersihkan timer jika user mengetik lagi sebelum 500ms habis
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // --- LOGIC FILTERING ---
  const filteredMountains = useMemo(() => {
    let result = [...mountains];

    // 1. Filter Search (Gunakan 'debouncedSearch', BUKAN 'search')
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
  // Perhatikan dependency array: gunakan debouncedSearch
  }, [mountains, debouncedSearch, filterDifficulty, filterGuide, sortBy]);

  // --- RESET HANDLER ---
  const handleReset = () => {
    setSearch(""); // Reset input text
    setDebouncedSearch(""); // Reset hasil pencarian
    setFilterDifficulty("all");
    setFilterGuide("all");
    setSortBy("populer");
  };

  return (
    <div className="bg-bg-soft min-h-screen pb-20 font-sans text-gray-700">
        
        {/* --- HEADER PENCARIAN --- */}
        <header className="bg-primary relative overflow-hidden h-48 md:h-56 flex items-center">
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-white text-center md:text-left">
                    <h1 className="text-3xl font-bold mb-1">Jelajahi Jalur</h1>
                    <p className="text-green-100 text-sm">Temukan destinasi pendakian terbaik di Bali</p>
                </div>
                
                <div className="bg-white p-1.5 rounded-xl flex w-full md:w-96 shadow-lg">
                    <input 
                        type="text" 
                        placeholder="Cari nama gunung..." 
                        className="flex-1 px-4 outline-none text-sm font-medium rounded-l-lg text-gray-700"
                        // Input tetap responsif menggunakan state 'search'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="bg-secondary text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-orange-600 transition">
                        {/* Indikator visual sederhana */}
                        {search !== debouncedSearch ? "..." : "🔍"}
                    </button>
                </div>
            </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
            
            {/* --- SIDEBAR FILTER --- */}
            <aside className="w-full lg:w-1/4 space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-900">Filter</h3>
                        <button onClick={handleReset} className="text-xs text-secondary font-medium hover:underline">Reset</button>
                    </div>

                    {/* FILTER 1: TINGKAT KESULITAN */}
                    <div className="mb-6">
                        <h4 className="text-sm font-bold text-gray-800 mb-3">Tingkat Kesulitan</h4>
                        <div className="flex flex-wrap gap-2">
                            {['easy', 'medium', 'hard'].map((level) => (
                                <button 
                                    key={level}
                                    onClick={() => setFilterDifficulty(filterDifficulty === level ? 'all' : level)}
                                    className={`text-xs px-3 py-1 rounded-full transition font-bold capitalize border ${
                                        filterDifficulty === level 
                                        ? 'bg-primary text-white border-primary' 
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary'
                                    }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* FILTER 2: GUIDE */}
                    <div className="mb-2">
                        <h4 className="text-sm font-bold text-gray-800 mb-3">Ketentuan Guide</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                            <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition">
                                <input 
                                    type="radio" 
                                    name="guide" 
                                    className="accent-primary w-4 h-4" 
                                    checked={filterGuide === 'all'}
                                    onChange={() => setFilterGuide('all')}
                                /> 
                                Semua
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition">
                                <input 
                                    type="radio" 
                                    name="guide" 
                                    className="accent-primary w-4 h-4" 
                                    checked={filterGuide === 'not_required'}
                                    onChange={() => setFilterGuide('not_required')}
                                /> 
                                Bebas (Tanpa Guide)
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition">
                                <input 
                                    type="radio" 
                                    name="guide" 
                                    className="accent-primary w-4 h-4" 
                                    checked={filterGuide === 'required'}
                                    onChange={() => setFilterGuide('required')}
                                /> 
                                Wajib Guide
                            </label>
                        </div>
                    </div>

                </div>
            </aside>

            {/* --- LIST GUNUNG --- */}
            <section className="w-full lg:w-3/4">
                
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <p className="text-sm text-gray-500">
                        Menampilkan <span className="font-bold text-gray-800">{filteredMountains.length}</span> gunung
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 hidden sm:block">Urutkan:</span>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="text-sm font-medium bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-primary cursor-pointer"
                        >
                            <option value="populer">Paling Baru</option>
                            <option value="termurah">Harga Termurah</option>
                            <option value="rating">Rating Tertinggi</option>
                            <option value="tertinggi">Mdpl Tertinggi</option>
                        </select>
                    </div>
                </div>

                {/* Grid Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
                    {filteredMountains.length > 0 ? (
                        filteredMountains.map((mountain) => (
                            <MountainCard key={mountain.id} mountain={mountain} />
                        ))
                    ) : (
                        <div className="col-span-3 py-16 text-center border-2 border-dashed border-gray-200 rounded-2xl">
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