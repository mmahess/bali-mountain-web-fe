import FrontpageLayout from "@/components/layouts/FrontpageLayout";
import HomePage from "@/components/pages/home/HomePage";

export const dynamic = 'force-dynamic';

async function getHomeData() {
  try {

    const tripsReq = fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trips?limit=3`, { cache: 'no-store' });

    const galleryReq = fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/galleries?limit=4`, { cache: 'no-store' });

    const trailsReq = fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hiking-trails/popular?limit=5`, { cache: 'no-store' });

    const [tripsRes, galleryRes, trailsRes] = await Promise.all([tripsReq, galleryReq, trailsReq]);

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