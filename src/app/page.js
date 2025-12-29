import FrontpageLayout from "@/components/layouts/FrontpageLayout";
import HomePage from "@/components/pages/home/HomePage";

async function getHomeData() {
  try {
    // KITA REQUEST 3 DATA SECARA PARALEL AGAR LEBIH CEPAT
    
    // 1. Fetch Trips / Ajakan (Limit 3)
    const tripsReq = fetch('http://localhost:8000/api/trips?limit=3', { cache: 'no-store' });
    
    // 2. Fetch Gallery / Foto (Limit 4)
    const galleryReq = fetch('http://localhost:8000/api/galleries?limit=4', { cache: 'no-store' });

    // 3. Fetch Popular Trails / Jalur Populer (Limit 5) -> BAGIAN INI DITAMBAHKAN
    const trailsReq = fetch('http://localhost:8000/api/hiking-trails/popular?limit=5', { cache: 'no-store' });

    // Tunggu semua request selesai
    const [tripsRes, galleryRes, trailsRes] = await Promise.all([tripsReq, galleryReq, trailsReq]);

    // Parse JSON (gunakan data kosong jika gagal)
    const tripsJson = tripsRes.ok ? await tripsRes.json() : { data: [] };
    const galleryJson = galleryRes.ok ? await galleryRes.json() : { data: [] };
    const trailsJson = trailsRes.ok ? await trailsRes.json() : { data: [] };

    return { 
      trips: tripsJson.data || [], 
      gallery: galleryJson.data || [],
      trails: trailsJson.data || [] // Data gunung rating tertinggi masuk di sini
    };

  } catch (error) {
    console.error("Home API Error:", error);
    // Return struktur data kosong agar halaman tidak error/blank
    return { trails: [], trips: [], gallery: [] };
  }
}

export default async function Page() {
  const homeData = await getHomeData();

  return (
    <FrontpageLayout>
      {/* Data lengkap dikirim ke HomePage */}
      <HomePage data={homeData} />
    </FrontpageLayout>
  );
}