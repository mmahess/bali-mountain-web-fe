import FrontpageLayout from "@/components/layouts/FrontpageLayout";
import HomePage from "@/components/pages/home/HomePage";

// --- API FETCHING ---
async function getMountains() {
  const res = await fetch('http://127.0.0.1:8000/api/mountains', { 
    cache: 'no-store' 
  });

  if (!res.ok) {
    throw new Error('Gagal mengambil data gunung');
  }

  const json = await res.json();
  return json.data;
}

export default async function Page() {
  let mountains = [];
  try {
    mountains = await getMountains();
  } catch (error) {
    console.log("Error Fetching Data: ", error.message);
  }

  return (
    <FrontpageLayout>
      <HomePage mountains={mountains} />
    </FrontpageLayout>
  );
}