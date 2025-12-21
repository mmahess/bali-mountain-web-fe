import FrontpageLayout from "@/components/layouts/FrontpageLayout";
import HomePage from "@/components/pages/home/HomePage";

async function getHomeData() {
  try {
    // KITA UBAH DISINI:
    // Jangan panggil /api/home (karena belum ada), tapi panggil endpoint yang sudah pasti ada.
    
    // 1. Ambil Data Trips (Limit 3)
    const tripsRes = await fetch('http://localhost:8000/api/trips?limit=3', { 
      cache: 'no-store' 
    });
    
    // 2. Ambil Data Gallery (Limit 4)
    const galleryRes = await fetch('http://localhost:8000/api/galleries?limit=4', { 
      cache: 'no-store' 
    });

    // Cek respon
    const tripsJson = tripsRes.ok ? await tripsRes.json() : { data: [] };
    const galleryJson = galleryRes.ok ? await galleryRes.json() : { data: [] };

    // Gabungkan jadi satu object 'data' seperti yang diminta HomePage
    return { 
      trails: [], // Kosongkan dulu kalau belum ada API trails
      trips: tripsJson.data || [], 
      gallery: galleryJson.data || [] 
    };

  } catch (error) {
    console.error("API Error:", error);
    return { trails: [], trips: [], gallery: [] };
  }
}

export default async function Page() {
  const homeData = await getHomeData();

  return (
    <FrontpageLayout>
      {/* Kirim data yang sudah valid ke HomePage */}
      <HomePage data={homeData} />
    </FrontpageLayout>
  );
}