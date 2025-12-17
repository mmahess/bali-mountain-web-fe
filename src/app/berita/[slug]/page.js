import FrontpageLayout from "@/components/layouts/FrontpageLayout";
import NewsDetailPage from "@/components/pages/news/NewsDetailPage";
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
    // Gabungkan hotNews dan latestNews jadi satu array
    const hot = json.data.hotNews ? [json.data.hotNews] : [];
    return [...hot, ...json.data.latestNews];
  } catch (error) {
    return [];
  }
}

export default async function Page({ params }) {
  // Await params (Next.js 15)
  const { slug } = await params;

  // Fetch Data Paralel
  const newsDetailData = getNewsDetail(slug);
  const newsListData = getNewsList();

  const [newsDetail, newsList] = await Promise.all([newsDetailData, newsListData]);

  // 404 Handler
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

  return (
    <FrontpageLayout>
      <NewsDetailPage newsDetail={newsDetail} newsList={newsList} />
    </FrontpageLayout>
  );
}