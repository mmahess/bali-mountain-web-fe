import FrontpageLayout from "@/components/layouts/FrontpageLayout";
import CommunityPage from "@/components/pages/community/CommunityPage";

// 1. Fetch Gallery (Server Side)
async function getGalleries() {
  try {
    const res = await fetch('http://localhost:8000/api/galleries', { cache: 'no-store' });
    if (!res.ok) {
        console.error("Gallery Fetch Error:", res.status);
        return []; // Return array kosong jika gagal, biar gak crash
    }
    const json = await res.json();
    return json.data || []; 
  } catch (error) {
    console.error("Gagal koneksi ke API Gallery:", error);
    return [];
  }
}

// 2. Fetch Trips / Feed (Server Side)
async function getTrips() {
  try {
    const res = await fetch('http://localhost:8000/api/trips', { cache: 'no-store' });
    if (!res.ok) {
        console.error("Trips Fetch Error:", res.status); // Cek console terminal VS Code kamu untuk lihat kode errornya (404/500)
        return []; 
    }
    const json = await res.json();
    return json.data || []; 
  } catch (error) {
    console.error("Gagal koneksi ke API Trips:", error);
    return [];
  }
}

export default async function Page() {
  // Ambil data secara paralel
  const [galleryData, feedData] = await Promise.all([
    getGalleries(),
    getTrips()
  ]);

  // Gabungkan data
  const initialData = {
    gallery: galleryData,
    feed: feedData
  };

  return (
    <FrontpageLayout>
      {/* Pastikan HANYA mengirim 'data'. JANGAN menulis token={...} di sini */}
      <CommunityPage data={initialData} />
    </FrontpageLayout>
  );
}