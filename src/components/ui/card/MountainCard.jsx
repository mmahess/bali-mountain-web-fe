import Link from "next/link";

export default function MountainCard({ mountain }) {
  // Helper untuk warna badge difficulty
  const getDifficultyColor = (level) => {
    switch (level) {
      case 'hard': return 'bg-red-100 text-red-600 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'easy': return 'bg-green-100 text-green-600 border-green-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Helper Format Rating (agar tampil 1 angka di belakang koma, misal 4.5)
  const formatRating = (val) => {
     if (!val) return "0.0";
     return parseFloat(val).toFixed(1);
  };

  return (
    <Link href={`/gunung/${mountain.slug}`} className="block h-full">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition duration-300 group flex flex-col h-full cursor-pointer relative">
        
        {/* Gambar Cover */}
        <div className="relative h-48 overflow-hidden">
          <img 
            // Pastikan URL gambar lengkap
            src={mountain.cover_image && !mountain.cover_image.startsWith('http') 
                ? `http://localhost:8000/storage/${mountain.cover_image}` 
                : (mountain.cover_image || "https://placehold.co/600x400")} 
            alt={mountain.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
          
          <div className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide border ${getDifficultyColor(mountain.difficulty_level)}`}>
            {mountain.difficulty_level}
          </div>

          <button className="absolute top-3 right-3 bg-white/80 p-1.5 rounded-full hover:bg-white hover:text-red-500 transition z-10">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
             </svg>
          </button>
        </div>

        {/* Info Content */}
        <div className="p-4 flex flex-col grow">
          <div className="flex items-start justify-between mb-1">
             <div>
                <h3 className="font-bold text-gray-800 text-lg group-hover:text-primary transition">{mountain.name}</h3>
                <p className="text-xs text-gray-400 truncate">{mountain.location}</p>
             </div>
             
             {/* --- BAGIAN RATING DINAMIS --- */}
             <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded text-yellow-600 text-xs font-bold border border-yellow-100">
                <span>★</span> {formatRating(mountain.reviews_avg_rating)}
             </div>
             {/* ----------------------------- */}

          </div>
          
          <div className="mt-4 space-y-2 mb-6 text-xs text-gray-500">
             <div className="flex items-center gap-2">
                <span className="w-4 text-center">⛰</span> {mountain.elevation} mdpl
             </div>
             <div className="flex items-center gap-2">
                <span className="w-4 text-center">📏</span> {mountain.distance} km
             </div>
             <div className="flex items-center gap-2">
                <span className="w-4 text-center">⏱</span> {mountain.estimation_time}
             </div>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-100">
             <span className="block w-full text-center bg-primary text-white text-sm font-bold px-4 py-2.5 rounded-xl group-hover:bg-green-700 transition shadow-lg shadow-green-100">
                Lihat Detail Jalur
             </span>
          </div>
        </div>
      </div>
    </Link>
  );
}