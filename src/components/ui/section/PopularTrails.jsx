import Link from "next/link";

export default function PopularTrails({ mountains }) {
  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Jalur Populer ⭐</h2>
        <Link href="/gunung" className="text-primary text-sm font-bold hover:underline">Lihat Semua</Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {mountains.length > 0 ? (
          mountains.map((mountain) => (
            <div key={mountain.id} className="bg-white rounded-3xl overflow-hidden shadow-card group hover:shadow-xl transition duration-300 border border-transparent hover:border-gray-100">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={mountain.cover_image || "https://placehold.co/600x400"} 
                  alt={mountain.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                  <span className={`text-[10px] font-extrabold tracking-wider ${
                    mountain.difficulty_level === 'hard' ? 'text-red-600' : 
                    mountain.difficulty_level === 'medium' ? 'text-orange-500' : 'text-green-600'
                  }`}>
                    {mountain.difficulty_level.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-base text-gray-800 truncate mb-1">{mountain.name}</h3>
                <p className="text-[11px] text-gray-400 mb-4 flex items-center gap-1">
                  📍 {mountain.location}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <span className="text-[11px] font-bold bg-gray-50 text-gray-600 px-2 py-1 rounded-md">
                    ⛰️ {mountain.elevation} mdpl
                  </span>
                  <Link href={`/gunung/${mountain.slug}`} className="text-primary text-xs font-bold hover:underline">
                    Detail
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-4 py-12 text-center bg-gray-50 rounded-3xl border-dashed border-2 border-gray-200">
            <p className="text-gray-400 font-medium">Data gunung tidak muncul? Pastikan Laravel menyala.</p>
          </div>
        )}
      </div>
    </section>
  );
}