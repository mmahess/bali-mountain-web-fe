import Link from "next/link";
import MountainCard from "@/components/ui/card/MountainCard"; // Import Kartu Baru

export default function PopularTrails({ mountains }) {
  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Jalur Populer ⭐</h2>
        <Link href="/gunung" className="text-primary text-sm font-bold hover:underline">Lihat Semua</Link>
      </div>
      
      {/* Grid Gunung */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {mountains && mountains.length > 0 ? (
          mountains.map((mountain) => (
            // SEKARANG KITA PAKAI KOMPONEN KARTU YANG SAMA DENGAN KATALOG
            <MountainCard key={mountain.id} mountain={mountain} />
          ))
        ) : (
          <div className="col-span-4 py-12 text-center bg-gray-50 rounded-3xl border-dashed border-2 border-gray-200">
            <p className="text-gray-400 font-medium">Data gunung tidak muncul.</p>
          </div>
        )}
      </div>

    </section>
  );
}