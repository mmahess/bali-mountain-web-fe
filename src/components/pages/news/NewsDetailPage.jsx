import Link from "next/link";
import NewsSidebar from "@/components/ui/section/news/NewsSidebar";

export default function NewsDetailPage({ newsDetail, newsList }) {
  if (!newsDetail) return null;

  // Format Tanggal
  const date = new Date(newsDetail.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-bg-soft min-h-screen pb-20 font-sans text-gray-700">
        
        {/* --- HEADER --- */}
        <header className="bg-white pt-10 pb-8 border-b border-gray-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                {/* Breadcrumb & Kategori */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-4 font-medium">
                    <Link href="/berita" className="hover:text-primary">Berita</Link>
                    <span>/</span>
                    <span className="text-primary font-bold">{newsDetail.category || "Tips & Trik"}</span>
                </div>

                {/* Judul Artikel */}
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {newsDetail.title}
                </h1>

                {/* Meta Info (Penulis & Tanggal) */}
                <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        {/* Avatar Penulis (Dinamis) */}
                        <img 
                            src={newsDetail.user?.avatar || `https://ui-avatars.com/api/?name=${newsDetail.user?.name || 'Admin'}&background=random`} 
                            className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                            alt="Penulis"
                        />
                        {/* Nama Penulis (Dinamis) */}
                        <span className="font-bold text-gray-900">
                            {newsDetail.user?.name || "Admin JejakKaki"}
                        </span>
                    </div>
                    <span>•</span>
                    <span>{date}</span>
                </div>
            </div>
        </header>

        {/* --- MAIN CONTENT --- */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Kiri: Artikel Utama */}
                <article className="lg:col-span-2">
                    
                    {/* Gambar Cover */}
                    <div className="rounded-2xl overflow-hidden mb-8 shadow-lg bg-gray-100">
                        <img 
                            src={newsDetail.thumbnail || "https://placehold.co/1200x600"} 
                            alt={newsDetail.title} 
                            className="w-full h-auto object-cover"
                        />
                        <p className="text-xs text-center text-gray-400 mt-2 italic">
                            Ilustrasi: {newsDetail.title}
                        </p>
                    </div>

                    {/* Isi Artikel (HTML Rendered) */}
                    <div className="prose prose-lg max-w-none text-gray-800 font-serif leading-loose">
                        <div 
                            dangerouslySetInnerHTML={{ __html: newsDetail.content }} 
                            className="
                                [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:mt-8
                                [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-3 [&>h2]:mt-8
                                [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mb-3 [&>h3]:mt-6
                                [&>p]:mb-4 
                                [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4
                                [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4
                                [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:bg-gray-50 [&>blockquote]:p-4 [&>blockquote]:rounded-r-lg [&>blockquote]:my-6
                                [&>img]:rounded-xl [&>img]:my-6 [&>img]:w-full [&>img]:shadow-sm
                                [&>a]:text-primary [&>a]:underline [&>a]:font-bold
                            "
                        />
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

                    {/* Komentar Section (Static Placeholder) */}
                    <div className="mt-10 font-sans">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Komentar</h3>
                        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                            <p className="text-gray-400 text-sm">Fitur komentar segera hadir.</p>
                        </div>
                    </div>

                </article>

                {/* Kanan: Sidebar */}
                <NewsSidebar 
                    newsList={newsList} 
                    currentSlug={newsDetail.slug} 
                />

            </div>
        </main>
    </div>
  );
}