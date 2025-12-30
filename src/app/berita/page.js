import FrontpageLayout from "@/components/layouts/FrontpageLayout";
import NewsPage from "@/components/pages/news/NewsPage";

async function getNewsData() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/news', { 
      cache: 'no-store' 
    });

    if (!res.ok) throw new Error('Gagal fetch data berita');
    const json = await res.json();
    let data = json.data;

    // Helper untuk memastikan URL gambar mengarah ke server backend
    const fixUrl = (path) => {
      if (!path) return "https://placehold.co/1200x600?text=No+Image";
      // Jika sudah ada http, gunakan langsung, jika tidak tambahkan domain backend
      return path.startsWith('http') ? path : `http://127.0.0.1:8000/storage/${path}`;
    };

    // 1. Perbaiki URL gambar untuk Hot News
    if (data.hotNews) {
      data.hotNews.thumbnail = fixUrl(data.hotNews.thumbnail);
    }

    // 2. Perbaiki URL gambar untuk semua Latest News
    if (data.latestNews && data.latestNews.length > 0) {
      data.latestNews = data.latestNews.map(news => ({
        ...news,
        thumbnail: fixUrl(news.thumbnail)
      }));
    }

    return data;
  } catch (error) {
    console.error(error);
    return { hotNews: null, latestNews: [] };
  }
}

export default async function Page() {
  const data = await getNewsData();

  return (
    <FrontpageLayout>
      <NewsPage data={data} />
    </FrontpageLayout>
  );
}