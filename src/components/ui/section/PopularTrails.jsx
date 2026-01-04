import Link from "next/link";
import MountainCard from "@/components/ui/card/MountainCard"; 

export default function PopularTrails({ mountains }) {
  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="flex justify-between items-center mb-6 md:mb-8">
        <div>
            <h2 className="text-xl md:text-3xl font-bold text-gray-900">Jalur Populer 🔥</h2>
            <p className="text-gray-500 text-sm mt-1 hidden md:block">Pilihan favorit pendaki berdasarkan rating.</p>
        </div>
        <Link href="/gunung" className="text-primary text-sm font-bold hover:underline">Lihat Semua</Link>
      </div>
      
      <div className="
        flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide
        md:grid md:grid-cols-3 lg:grid-cols-5 md:overflow-visible md:pb-0 md:mx-0 md:px-0
      ">
        {mountains && mountains.length > 0 ? (
          mountains.map((mountain) => (
            <div key={mountain.id} className="min-w-[180px] w-[180px] md:w-auto md:min-w-0 h-full snap-center">
                <MountainCard mountain={mountain} />
            </div>
          ))
        ) : (
          <div className="w-full col-span-full py-12 text-center bg-gray-50 rounded-3xl border-dashed border-2 border-gray-200">
            <p className="text-gray-400 font-medium">Belum ada data jalur gunung.</p>
          </div>
        )}
      </div>

    </section>
  );
}