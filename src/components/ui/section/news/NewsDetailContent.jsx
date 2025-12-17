import Link from "next/link";

export default function NewsDetailContent({ news }) {
  if (!news) return null;

  // Format Tanggal
  const date = new Date(news.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="lg:col-span-2">
      
      {/* Gambar Utama */}
      <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
        <img 
            src={news.thumbnail || "https://placehold.co/1200x600"} 
            alt={news.title} 
            className="w-full h-auto object-cover"
        />
        <p className="text-xs text-center text-gray-400 mt-2 italic">
            Ilustrasi: {news.title}
        </p>
      </div>

      {/* Konten Artikel */}
      {/* Menggunakan whitespace-pre-line agar enter di database terbaca sebagai paragraf */}
      <div className="prose max-w-none text-gray-800 font-serif leading-loose text-lg space-y-6 whitespace-pre-line">
        <p>
            <span className="font-bold text-5xl float-left mr-3 -mt-2.5 text-primary font-sans">
                {news.content.charAt(0)}
            </span>
            {news.content.substring(1)}
        </p>
      </div>

      {/* Share Buttons (Static) */}
      <div className="border-y border-gray-200 py-6 mt-10 flex flex-col md:flex-row justify-between items-center gap-4 font-sans">
        <p className="text-sm font-bold text-gray-500">Bagikan artikel ini:</p>
        <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition">WA</button>
            <button className="w-10 h-10 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:opacity-90 transition">TW</button>
            <button className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition">FB</button>
            <button className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition">🔗</button>
        </div>
      </div>

      {/* Komentar (Placeholder Statis) */}
      <div className="mt-10 font-sans">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Komentar (0)</h3>
        
        <div className="flex gap-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=User" className="w-full h-full object-cover"/>
            </div>
            <div className="grow">
                <textarea className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-primary transition h-24 mb-2" placeholder="Tulis tanggapanmu..."></textarea>
                <button className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-green-700 float-right transition">Kirim Komentar</button>
            </div>
        </div>

        <div className="text-center py-4 border border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-400 text-sm">Belum ada komentar.</p>
        </div>
      </div>

    </article>
  );
}