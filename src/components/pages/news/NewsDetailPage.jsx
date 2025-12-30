"use client";

import Link from "next/link";
import NewsSidebar from "@/components/ui/section/news/NewsSidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function NewsDetailPage({ newsDetail, newsList }) {
  // State untuk Komentar & User
  const [comments, setComments] = useState(newsDetail?.comments || []);
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Ambil user dari localStorage saat component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
  }, []);

  if (!newsDetail) return null;

  // --- HELPER URL GAMBAR (Agar gambar tidak broken) ---
  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/1200x600?text=No+Image";
    if (path.startsWith("http")) return path;
    return `${process.env.NEXT_PUBLIC_API_URL}/storage/${path}`;
  };

  const getAvatarUrl = (user) => {
    if (!user) return "https://ui-avatars.com/api/?name=User";
    if (user.avatar && !user.avatar.startsWith("http")) {
        return `${process.env.NEXT_PUBLIC_API_URL}/storage/${user.avatar}`;
    }
    return user.avatar || `https://ui-avatars.com/api/?name=${user.name}`;
  };

  // --- HANDLER POST KOMENTAR ---
  const handlePostComment = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Silakan login dulu 🔒");
    if (!input.trim()) return toast.error("Komentar tidak boleh kosong");

    setIsSubmitting(true);
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/news/${newsDetail.id}/comments`, 
            { body: input },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        // Tambahkan komentar baru ke state (paling atas)
        setComments([res.data.data, ...comments]);
        setInput("");
        toast.success("Komentar terkirim! 💬");
    } catch (error) {
        console.error(error);
        toast.error("Gagal mengirim komentar");
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- HANDLER HAPUS KOMENTAR ---
  const handleDeleteComment = async (id) => {
    if (!confirm("Hapus komentar ini?")) return;
    const token = localStorage.getItem("token");
    
    try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/news/comments/${id}`, {
            headers: { Authorization: `Bearer ${token}` } 
        });
        setComments(comments.filter(c => c.id !== id));
        toast.success("Komentar dihapus 🗑️");
    } catch (error) {
        toast.error("Gagal menghapus");
    }
  };

  // Format Tanggal Artikel
  const date = new Date(newsDetail.created_at).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="bg-bg-soft min-h-screen pb-20 font-sans text-gray-700">
        
        {/* --- HEADER --- */}
        <header className="bg-white pt-10 pb-8 border-b border-gray-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-4 font-medium">
                    <Link href="/berita" className="hover:text-primary">Berita</Link>
                    <span>/</span>
                    <span className="text-primary font-bold">{newsDetail.category || "Tips & Trik"}</span>
                </div>

                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {newsDetail.title}
                </h1>

                <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <img 
                            src={getAvatarUrl(newsDetail.user)} 
                            className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                            alt="Penulis"
                        />
                        <span className="font-bold text-gray-900">
                            {newsDetail.user?.name || "Admin"}
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
                            src={getImageUrl(newsDetail.thumbnail)} 
                            alt={newsDetail.title} 
                            className="w-full h-auto object-cover"
                        />
                        <p className="text-xs text-center text-gray-400 mt-2 italic">
                            Ilustrasi: {newsDetail.title}
                        </p>
                    </div>

                    {/* Isi Artikel */}
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

                    {/* Share Buttons */}
                    <div className="border-y border-gray-200 py-6 mt-10 flex flex-col md:flex-row justify-between items-center gap-4 font-sans">
                        <p className="text-sm font-bold text-gray-500">Bagikan artikel ini:</p>
                        <div className="flex gap-3">
                            <button className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition">WA</button>
                            <button className="w-10 h-10 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:opacity-90 transition">TW</button>
                            <button className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition">FB</button>
                            <button className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition">🔗</button>
                        </div>
                    </div>

                    {/* --- KOMENTAR SECTION (DINAMIS) --- */}
                    <div className="mt-10 font-sans">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Komentar ({comments.length})</h3>
                        
                        {/* Form Input */}
                        <div className="flex gap-4 mb-10">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100 shrink-0">
                                <img 
                                    src={getAvatarUrl(currentUser)} 
                                    className="w-full h-full object-cover"
                                    alt="Saya"
                                />
                            </div>
                            <div className="grow">
                                <textarea 
                                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition h-24 mb-2" 
                                    placeholder={currentUser ? "Tulis tanggapanmu..." : "Silakan login untuk berkomentar..."}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    disabled={!currentUser || isSubmitting}
                                ></textarea>
                                <button 
                                    onClick={handlePostComment}
                                    disabled={!currentUser || isSubmitting || !input.trim()}
                                    className="bg-primary text-white text-xs font-bold px-6 py-2.5 rounded-lg hover:bg-green-700 float-right transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-green-100"
                                >
                                    {isSubmitting ? "Mengirim..." : "Kirim Komentar"}
                                </button>
                            </div>
                        </div>

                        {/* List Komentar */}
                        <div className="space-y-6">
                            {comments.length > 0 ? (
                                comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-4 border-b border-gray-50 pb-6 last:border-0 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100 shrink-0">
                                            <img 
                                                src={getAvatarUrl(comment.user)} 
                                                className="w-full h-full object-cover" 
                                                alt={comment.user?.name}
                                            />
                                        </div>
                                        <div className="grow">
                                            <div className="flex justify-between items-start mb-1">
                                                <div>
                                                    <h4 className="font-bold text-sm text-gray-900">{comment.user?.name || "User"}</h4>
                                                    <p className="text-[10px] text-gray-400">
                                                        {new Date(comment.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                                
                                                {/* Tombol Hapus (Milik sendiri / Admin) */}
                                                {currentUser && (currentUser.id === comment.user_id || currentUser.role === 'admin') && (
                                                    <button 
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        className="text-red-400 hover:text-red-600 text-xs font-bold hover:underline transition"
                                                    >
                                                        Hapus
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                                                {comment.body}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                                    <p className="text-gray-400 text-sm">Belum ada komentar. Jadilah yang pertama!</p>
                                </div>
                            )}
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