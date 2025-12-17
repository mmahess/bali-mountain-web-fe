import FrontpageLayout from "@/components/layouts/FrontpageLayout";
import MapViewer from "@/components/ui/section/MapViewer";
import Link from "next/link";

// --- FUNGSI FETCH DATA ---
async function getMountainDetail(slug) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/mountains/${slug}`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    return null;
  }
}

export default async function MountainDetailPage({ params }) {
  const { slug } = await params;
  const mountain = await getMountainDetail(slug);

  if (!mountain) {
    return (
      <FrontpageLayout>
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-bg-soft">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-gray-500 mb-6">Gunung tidak ditemukan.</p>
          <Link href="/" className="bg-primary text-white px-6 py-2 rounded-full font-bold">Kembali ke Beranda</Link>
        </div>
      </FrontpageLayout>
    );
  }

  // LOGIC AMAN: Memastikan nilai '0' atau '1' dari database dibaca dengan benar sebagai boolean
  const isWajibGuide = mountain.is_guide_required == 1 || mountain.is_guide_required === true;

  return (
    <FrontpageLayout>
      <div className="bg-bg-soft min-h-screen pb-20 font-sans text-gray-700">
        
        {/* HERO HEADER */}
        <header className="relative h-[400px] md:h-[500px] w-full">
          <img 
            src={mountain.cover_image || "https://placehold.co/1200x600"} 
            alt={mountain.name} 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent"></div>

          <div className="absolute bottom-0 left-0 w-full pb-12 pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-gray-300 text-xs mb-3 font-medium">
                        <Link href="/" className="hover:text-white transition">Beranda</Link>
                        <span>/</span>
                        <Link href="/gunung" className="hover:text-white transition">Katalog</Link>
                        <span>/</span>
                        <span className="text-white font-bold">{mountain.name}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 shadow-sm leading-tight">
                        {mountain.name}
                    </h1>
                    <p className="text-gray-200 text-lg flex items-center gap-2">
                        <span>📍</span> {mountain.location}
                    </p>
                </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-16 relative z-10">
            
            {/* STATS BAR */}
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 border border-gray-100">
                <div className="text-center border-r border-gray-100 last:border-0">
                    <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase mb-1 tracking-wider">Ketinggian</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-800">
                        {mountain.elevation} <span className="text-xs text-gray-400 font-normal">mdpl</span>
                    </p>
                </div>
                <div className="text-center border-r border-gray-100 last:border-0">
                    <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase mb-1 tracking-wider">Elevasi Gain</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-800">
                        {mountain.elevation_gain} <span className="text-xs text-gray-400 font-normal">m</span>
                    </p>
                </div>
                <div className="text-center border-r border-gray-100 last:border-0">
                    <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase mb-1 tracking-wider">Estimasi Waktu</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-800">
                        {mountain.estimation_time}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase mb-1 tracking-wider">Jarak Tempuh</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-800">
                        {mountain.distance} <span className="text-xs text-gray-400 font-normal">km</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT CONTENT */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Tentang {mountain.name}</h2>
                        <div className="prose prose-green max-w-none text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
                            {mountain.description}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Galeri Foto</h2>
                        {mountain.images && mountain.images.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {mountain.images.map((img, index) => (
                                    <div key={index} className="h-32 w-full rounded-xl overflow-hidden relative group">
                                        <img 
                                            src={img.image_url} 
                                            alt={`Galeri ${index + 1}`} 
                                            className="w-full h-full object-cover hover:scale-110 transition duration-500 cursor-pointer"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-300 text-center">
                                <p className="text-gray-500 text-sm">Belum ada foto galeri.</p>
                            </div>
                        )}
                    </section>

                    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                Ulasan Pendaki ({mountain.reviews ? mountain.reviews.length : 0})
                            </h2>
                            <button className="text-primary font-bold text-sm hover:underline">Tulis Ulasan</button>
                        </div>

                        {mountain.reviews && mountain.reviews.length > 0 ? (
                            <div className="space-y-6">
                                {mountain.reviews.map((review) => (
                                    <div key={review.id} className="flex gap-4 border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                                            <img 
                                                src={review.user?.avatar || `https://ui-avatars.com/api/?name=${review.user?.name || 'User'}`} 
                                                alt={review.user?.name} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-900">{review.user?.name || 'Pendaki'}</h4>
                                            <div className="text-yellow-400 text-xs mb-1">
                                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-2">💬</div>
                                <p className="text-gray-500 text-sm font-medium">Belum ada ulasan. Jadilah yang pertama!</p>
                            </div>
                        )}
                    </section>
                </div>

                {/* RIGHT SIDEBAR */}
                <aside className="space-y-6 sticky top-24 h-fit">
                    
                    {/* INFO PENTING */}
                    {/* Menggunakan variabel isWajibGuide yang sudah kita amankan logikanya */}
                    <div className={`bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-l-4 ${isWajibGuide ? 'border-red-500' : 'border-green-500'}`}>
                        <h3 className="font-bold text-gray-900 mb-4 text-sm flex items-center gap-2 uppercase tracking-wide">
                            <span>ℹ️</span> Informasi Penting
                        </h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex gap-3 items-start">
                                <span className={`${isWajibGuide ? 'text-red-500' : 'text-green-500'} font-bold`}>•</span>
                                <span className="font-medium">
                                    {isWajibGuide ? 'Wajib Menggunakan Guide' : 'Tidak wajib menggunakan guide'}
                                </span>
                            </li>
                            <li className="flex gap-3 items-start">
                                <span className="text-green-500 font-bold">•</span>
                                <span>Tiket: Rp {parseInt(mountain.ticket_price).toLocaleString('id-ID')}</span>
                            </li>
                            <li className="flex gap-3 items-start">
                                <span className="text-green-500 font-bold">•</span>
                                <span>Registrasi di {mountain.starting_point}</span>
                            </li>
                        </ul>
                        <div className="mt-6 pt-4 border-t border-gray-100">
                             <button className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-100 text-sm">
                                Buat Open Trip Disini
                            </button>
                        </div>
                    </div>

                    {/* CARD MAP VIEWER */}
                    <MapViewer mapUrl={mountain.map_iframe_url} />

                </aside>
            </div>
        </main>
      </div>
    </FrontpageLayout>
  );
}