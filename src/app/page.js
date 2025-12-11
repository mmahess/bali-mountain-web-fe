import FrontpageLayout from "@/components/layouts/FrontpageLayout";
import HomePage from "@/components/pages/home/HomePage";

async function getHomeData() {
  try {
    // Panggil Endpoint Home yang baru
    const res = await fetch('http://127.0.0.1:8000/api/home', { 
      cache: 'no-store' 
    });

    if (!res.ok) {
      throw new Error('Gagal mengambil data homepage');
    }

    const json = await res.json();
    return json.data; // Isinya { trails, trips, gallery }
  } catch (error) {
    console.error("API Error:", error);
    // Return objek kosong agar tidak error null
    return { trails: [], trips: [], gallery: [] };
  }
}

export default async function Page() {
  const homeData = await getHomeData();

  return (
    <FrontpageLayout>
      {/* Kirim seluruh paket data ke HomePage */}
      <HomePage data={homeData} />
    </FrontpageLayout>
  );
}