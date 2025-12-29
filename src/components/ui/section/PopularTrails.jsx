import Link from "next/link";
import MountainCard from "@/components/ui/card/MountainCard"; 

export default function PopularTrails({ mountains }) {
  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Jalur Populer 🔥</h2>
            <p className="text-gray-500 text-sm mt-1 hidden md:block">Pilihan favorit pendaki berdasarkan rating.</p>
        </div>
        <Link href="/gunung" className="text-primary text-sm font-bold hover:underline">Lihat Semua</Link>
      </div>
      
      {/* Grid Gunung - UPDATE DISINI */}
      {/* grid-cols-2 (HP), md:grid-cols-3 (Tablet), lg:grid-cols-5 (Laptop/PC) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {mountains && mountains.length > 0 ? (
          mountains.map((mountain) => (
            // Bungkus dengan div agar height-nya seragam
            <div key={mountain.id} className="h-full">
                <MountainCard mountain={mountain} />
            </div>
          ))
        ) : (
          // Empty State (col-span-full agar melebar penuh)
          <div className="col-span-full py-12 text-center bg-gray-50 rounded-3xl border-dashed border-2 border-gray-200">
            <p className="text-gray-400 font-medium">Belum ada data jalur gunung.</p>
          </div>
        )}
      </div>

    </section>
  );
}