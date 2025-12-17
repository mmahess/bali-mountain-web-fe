import FrontpageLayout from "@/components/layouts/FrontpageLayout";
import NewsPage from "@/components/pages/news/NewsPage";

async function getNewsData() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/news', { 
      cache: 'no-store' 
    });

    if (!res.ok) throw new Error('Gagal fetch data berita');
    const json = await res.json();
    return json.data;
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