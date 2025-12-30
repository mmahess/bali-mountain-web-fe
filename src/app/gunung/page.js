import FrontpageLayout from "@/components/layouts/FrontpageLayout";
import CatalogPage from "@/components/pages/catalog/CatalogPage";

export const dynamic = 'force-dynamic';

// Fetch Data Gunung
async function getMountains() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mountains`, { 
      cache: 'no-store' 
    });

    if (!res.ok) {
      throw new Error('Gagal mengambil data katalog');
    }

    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
}

export default async function Page() {
  const mountains = await getMountains();

  return (
    <FrontpageLayout>
      <CatalogPage mountains={mountains} />
    </FrontpageLayout>
  );
}