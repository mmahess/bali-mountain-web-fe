import FrontpageLayout from "@/components/layouts/FrontpageLayout";
import NewsDetailPage from "@/components/pages/news/NewsDetailPage"; // Import Tetap Sesuai Aslinya
import Link from "next/link";

// 1. Fetch Detail Berita
async function getNewsDetail(slug) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/news/${slug}`, { 
      cache: 'no-store' 
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    return null;
  }
}

// 2. Fetch List Berita (Untuk Sidebar "Baca Juga")
async function getNewsList() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/news', { 
      cache: 'no-store' 
    });
    if (!res.ok) return [];
    const json = await res.json();
    const hot = json.data.hotNews ? [json.data.hotNews] : [];
    return [...hot, ...json.data.latestNews];
  } catch (error) {
    return [];
  }
}

export default async function Page({ params }) {
  const { slug } = await params;

  // Fetch Data
  const newsDetailData = getNewsDetail(slug);
  const newsListData = getNewsList();

  const [newsDetail, newsList] = await Promise.all([newsDetailData, newsListData]);

  if (!newsDetail) {
    return (
      <FrontpageLayout>
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-bg-soft">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-gray-500 mb-6">Berita tidak ditemukan.</p>
          <Link href="/berita" className="bg-primary text-white px-6 py-2 rounded-full font-bold">Kembali ke Berita</Link>
        </div>
      </FrontpageLayout>
    );
  }

  // --- LOGIKA PERBAIKAN URL GAMBAR (DI SINI) ---
  // Kita perbaiki datanya SEBELUM masuk ke komponen NewsDetailPage
  
  const fixImageUrl = (path) => {
    if (!path) return "https://placehold.co/1200x600?text=No+Image";
    if (path.startsWith("http")) return path;
    return `http://127.0.0.1:8000/storage/${path}`;
  };

  const fixAvatarUrl = (user) => {
    if (!user) return "";
    if (user.avatar && !user.avatar.startsWith("http")) {
        return `http://127.0.0.1:8000/storage/${user.avatar}`;
    }
    return user.avatar || `https://ui-avatars.com/api/?name=${user.name}`;
  };

  // Terapkan perbaikan ke object newsDetail
  if (newsDetail) {
      newsDetail.thumbnail = fixImageUrl(newsDetail.thumbnail);
      if (newsDetail.user) {
          newsDetail.user.avatar = fixAvatarUrl(newsDetail.user);
      }
  }

  // Terapkan perbaikan ke list berita (sidebar)
  const fixedNewsList = newsList.map(item => ({
      ...item,
      thumbnail: fixImageUrl(item.thumbnail)
  }));

  return (
    <FrontpageLayout>
      {/* Kirim data yang sudah diperbaiki URL-nya ke komponen asli Anda */}
      <NewsDetailPage newsDetail={newsDetail} newsList={fixedNewsList} />
    </FrontpageLayout>
  );
}