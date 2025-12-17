import FrontpageLayout from "@/components/layouts/FrontpageLayout";
import CommunityPage from "@/components/pages/community/CommunityPage";

async function getCommunityData() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/community', { 
      cache: 'no-store' 
    });

    if (!res.ok) throw new Error('Gagal fetch data komunitas');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error(error);
    return { feed: [], gallery: [] };
  }
}

export default async function Page() {
  const data = await getCommunityData();

  return (
    <FrontpageLayout>
      <CommunityPage data={data} />
    </FrontpageLayout>
  );
}