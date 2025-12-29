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
            <span className="text-primary">Jadi Lebih Mudah</span>
          </h1>
          <p className="text-gray-500 mb-8 text-base leading-relaxed max-w-lg">
            Tidak punya tim buat nanjak? Temukan barengan pendakian yang cocok atau gabung open trip terpercaya di sini.
          </p>
        </div>

        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <div className="relative w-full max-w-lg h-64 md:h-96 overflow-hidden rounded-4xl shadow-2xl">
            <img 
              src="/gunung-agung-simpang-jodoh.jpg" 
              alt="Hiking Group" 
              className="w-full h-full object-cover object-center transform hover:scale-105 transition duration-700"
            />
          </div>
        </div>
      </div>
    </header>
  );
}