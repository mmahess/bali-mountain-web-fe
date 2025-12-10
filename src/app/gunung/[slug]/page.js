import FrontpageLayout from "@/components/layouts/FrontpageLayout";
import DetailPage from "@/components/pages/detail/DetailPage"; // Pastikan path ini benar
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
    console.error("Fetch Error:", error);
    return null;
  }
}

export default async function MountainDetailPage({ params }) {
  // Await Params (Wajib di Next.js 15)
  const { slug } = await params;
  const mountain = await getMountainDetail(slug);

  // 404 Handler (Custom)
  if (!mountain) {
    return (
      <FrontpageLayout>
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-bg-soft">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-gray-500 mb-6">Gunung tidak ditemukan di database.</p>
          <Link href="/" className="bg-primary text-white px-6 py-2 rounded-full font-bold">Kembali ke Beranda</Link>
        </div>
      </FrontpageLayout>
    );
  }

  // Render Halaman Detail yang sudah dirapikan
  return (
    <FrontpageLayout>
      <DetailPage mountain={mountain} />
    </FrontpageLayout>
  );
}