// 1. Import Layout
import FrontpageLayout from "@/components/layouts/FrontpageLayout";

// 2. Import Komponen Tampilan Utama (yang sudah kamu rapikan)
import HomePage from "@/components/pages/home/HomePage"; 

// 3. Fungsi Fetch Data dari API
async function getMountains() {
  try {
    // Pastikan URL API backend Laravel benar
    const res = await fetch('http://127.0.0.1:8000/api/mountains', { 
      cache: 'no-store' 
    });

    if (!res.ok) {
      throw new Error('Gagal mengambil data gunung');
    }

    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("API Error:", error);
    return []; // Return array kosong jika error agar web tidak crash
  }
}

// 4. Komponen Halaman Utama (Wajib export default)
export default async function Page() {
  // Ambil data
  const mountains = await getMountains();

  // Render Tampilan
  return (
    <FrontpageLayout>
      {/* Kirim data gunung ke komponen HomePage */}
      <HomePage mountains={mountains} />
    </FrontpageLayout>
  );
}