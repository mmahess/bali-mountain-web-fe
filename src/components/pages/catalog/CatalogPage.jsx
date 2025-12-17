import MountainCard from "@/components/ui/card/MountainCard";

export default function CatalogPage({ mountains }) {
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
                    <input type="text" placeholder="Cari nama gunung..." className="flex-1 px-4 outline-none text-sm font-medium rounded-l-lg text-gray-700" />
                    <button className="bg-secondary text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-orange-600 transition">
                        Cari
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
                        <button className="text-xs text-secondary font-medium hover:underline">Reset</button>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-sm font-bold text-gray-800 mb-3">Lokasi</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                            <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition">
                                <input type="checkbox" className="accent-primary w-4 h-4 rounded" /> Kintamani
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition">
                                <input type="checkbox" className="accent-primary w-4 h-4 rounded" /> Bedugul
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition">
                                <input type="checkbox" className="accent-primary w-4 h-4 rounded" /> Karangasem
                            </label>
                        </div>
                    </div>

                    <div className="mb-2">
                        <h4 className="text-sm font-bold text-gray-800 mb-3">Tingkat Kesulitan</h4>
                        <div className="flex flex-wrap gap-2">
                            <button className="text-xs border border-gray-200 px-3 py-1 rounded-full hover:border-primary hover:text-primary transition font-medium">Easy</button>
                            <button className="text-xs border border-gray-200 px-3 py-1 rounded-full hover:border-primary hover:text-primary transition font-medium">Medium</button>
                            <button className="text-xs border border-gray-200 px-3 py-1 rounded-full hover:border-primary hover:text-primary transition font-medium">Hard</button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* --- LIST GUNUNG --- */}
            <section className="w-full lg:w-3/4">
                
                <div className="flex justify-between items-center mb-6">
                    <p className="text-sm text-gray-500">Menampilkan <span className="font-bold text-gray-800">{mountains.length}</span> gunung</p>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 hidden sm:block">Urutkan:</span>
                        <select className="text-sm font-medium bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-primary">
                            <option>Paling Populer</option>
                            <option>Termurah</option>
                            <option>Rating Tertinggi</option>
                        </select>
                    </div>
                </div>

                {/* Grid Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mountains.length > 0 ? (
                        mountains.map((mountain) => (
                            <MountainCard key={mountain.id} mountain={mountain} />
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-12 text-gray-400">
                            Tidak ada data gunung ditemukan.
                        </div>
                    )}
                </div>

                {/* Pagination (Visual Only) */}
                <div className="mt-12 flex justify-center">
                    <nav className="flex gap-2">
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-primary hover:text-primary transition">←</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold shadow-lg shadow-green-200">1</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 font-medium hover:border-primary hover:text-primary transition">→</button>
                    </nav>
                </div>

            </section>
        </main>
    </div>
  );
}