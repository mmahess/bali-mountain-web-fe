import Link from "next/link";

export default function HeroDetail({ mountain }) {
  return (
    <header className="relative h-[400px] md:h-[500px] w-full">
      <img 
        src={mountain.cover_image || "https://placehold.co/1200x600"} 
        alt={mountain.name} 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent"></div>

      <div className="absolute bottom-0 left-0 w-full pb-12 pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <div className="flex items-center gap-2 text-gray-300 text-xs mb-3 font-medium">
                    <Link href="/" className="hover:text-white transition">Beranda</Link>
                    <span>/</span>
                    <Link href="/gunung" className="hover:text-white transition">Katalog</Link>
                    <span>/</span>
                    <span className="text-white font-bold">{mountain.name}</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 shadow-sm leading-tight">
                    {mountain.name}
                </h1>
                <p className="text-gray-200 text-lg flex items-center gap-2">
                    <span>📍</span> {mountain.location}
                </p>
            </div>
        </div>
      </div>
    </header>
  );
}