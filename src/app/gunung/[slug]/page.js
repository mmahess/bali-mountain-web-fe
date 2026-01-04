import FrontpageLayout from "@/components/layouts/FrontpageLayout";
import MapViewer from "@/components/ui/section/MapViewer";
import MountainReviews from "@/components/ui/section/detail/MountainReviews"; 
import Link from "next/link";

export const dynamic = 'force-dynamic';

// --- FUNGSI FETCH DATA ---
async function getMountainDetail(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mountains/${slug}`, {
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

  const isWajibGuide = mountain.is_guide_required == 1 || mountain.is_guide_required === true;

  // --- HELPER BARU: GENERATE URL GAMBAR ---
  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/1200x600"; // Placeholder jika kosong
    if (path.startsWith("http")) return path; // Jika sudah URL lengkap (misal dari unsplash)
    return `${process.env.NEXT_PUBLIC_API_URL}/storage/${path}`; // Tambahkan prefix backend
  };

  return (
    <FrontpageLayout>
      <div className="bg-bg-soft min-h-screen pb-20 font-sans text-gray-700">
        
        {/* HERO HEADER */}
        <header className="relative h-[400px] md:h-[500px] w-full bg-gray-900">
          <img 
            // GUNAKAN HELPER DI SINI
            src={getImageUrl(mountain.cover_image)}
            alt={mountain.name} 
            className="absolute inset-0 w-full h-full object-cover opacity-90"
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
                    
                    {/* Deskripsi */}
                    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Tentang {mountain.name}</h2>
                        <div className="prose prose-green max-w-none text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
                            {mountain.description}
                        </div>
                    </section>

                    {/* Galeri (Jika ada API image_url yg sudah full, biarkan. Jika path, gunakan getImageUrl juga) */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Galeri Foto</h2>
                        {mountain.images && mountain.images.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {mountain.images.map((img, index) => (
                                    <div key={index} className="h-32 w-full rounded-xl overflow-hidden relative group">
                                        <img 
                                            // Asumsi: img.image_url sudah full URL dari backend/resource. 
                                            // Jika belum, gunakan: getImageUrl(img.path)
                                            src={img.image_url || getImageUrl(img.path)} 
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

                    {/* Component Ulasan */}
                    <MountainReviews 
                        mountainId={mountain.id} 
                        initialReviews={mountain.reviews} 
                    />

                </div>

                {/* RIGHT SIDEBAR */}
                <aside className="space-y-6 sticky top-24 h-fit">
                    
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

                    <MapViewer mapUrl={mountain.map_iframe_url} />

                </aside>
            </div>
        </main>
      </div>
    </FrontpageLayout>
  );
}