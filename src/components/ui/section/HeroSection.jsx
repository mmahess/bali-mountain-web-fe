export default function HeroSection() {
  return (
    <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-card flex flex-col-reverse md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/3 -translate-y-1/3"></div>

        <div className="w-full md:w-1/2 text-center md:text-left z-10">
          <span className="inline-block bg-orange-50 text-secondary text-xs font-bold px-4 py-1.5 rounded-full mb-4 border border-orange-100">
            👋 Gabung Komunitas
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900 mb-6">
            Cari Teman Muncak <br />
            <span className="text-primary">Jadi Lebih Mudah.</span>
          </h1>
          <p className="text-gray-500 mb-8 text-base leading-relaxed max-w-lg">
            Tidak punya tim buat nanjak? Temukan barengan pendakian yang cocok atau gabung open trip terpercaya di sini.
          </p>
          
          <div className="bg-gray-50 p-2 rounded-2xl border border-gray-200 flex flex-col sm:flex-row gap-2 max-w-md mx-auto md:mx-0 shadow-sm">
            <input 
              type="text" 
              placeholder="Mau nanjak ke mana?" 
              className="flex-1 px-4 py-3 bg-transparent outline-none text-sm font-medium text-gray-700 placeholder-gray-400" 
            />
            <button className="bg-secondary text-white rounded-xl px-8 py-3 font-bold hover:bg-orange-600 transition text-sm shadow-lg shadow-orange-200">
              Cari
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <div className="relative w-full max-w-lg h-64 md:h-96 overflow-hidden rounded-4xl shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1000&auto=format&fit=crop" 
              alt="Hiking Group" 
              className="w-full h-full object-cover object-center transform hover:scale-105 transition duration-700"
            />
          </div>
        </div>
      </div>
    </header>
  );
}