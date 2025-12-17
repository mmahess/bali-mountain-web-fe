"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function AdminNewsPage() {
  const [view, setView] = useState("list"); // 'list' | 'form'
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State Form
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    thumbnail: "",
    content: "",
    is_important: false
  });

  // 1. Fetch Data
  const fetchNews = async () => {
    setIsLoading(true);
    try {
      // Kita gunakan endpoint public untuk mengambil data
      const res = await fetch("http://127.0.0.1:8000/api/news", { cache: 'no-store' });
      const json = await res.json();
      
      // Gabungkan Hot News dan Berita Lainnya jadi satu list
      const hot = json.data.hotNews ? [json.data.hotNews] : [];
      const allNews = [...hot, ...json.data.latestNews];
      
      // Urutkan berdasarkan ID (terbaru di atas)
      setNewsList(allNews.sort((a, b) => b.id - a.id));
    } catch (error) {
      toast.error("Gagal memuat berita");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // 2. Handle Input Form (Termasuk Checkbox)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 3. Toggle Form
  const toggleForm = (show, data = null) => {
    if (show) {
      if (data) {
        setIsEditing(true);
        setEditId(data.id);
        setFormData({
            title: data.title || "",
            thumbnail: data.thumbnail || "",
            content: data.content || "",
            is_important: data.is_important ? true : false
        });
      } else {
        setIsEditing(false);
        setEditId(null);
        setFormData({ title: "", thumbnail: "", content: "", is_important: false });
      }
      setView("form");
    } else {
      setView("list");
    }
  };

  // 4. Submit Data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Menyimpan artikel...");
    
    try {
      const token = localStorage.getItem("token");
      const url = isEditing 
        ? `http://127.0.0.1:8000/api/news/${editId}`
        : "http://127.0.0.1:8000/api/news";
      
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Gagal menyimpan artikel");

      toast.success(isEditing ? "Artikel diperbarui!" : "Artikel diterbitkan!", { id: toastId });
      fetchNews();
      toggleForm(false);

    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  // 5. Delete Data
  const handleDelete = async (id) => {
    if(!confirm("Hapus artikel ini?")) return;
    
    const toastId = toast.loading("Menghapus...");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/api/news/${id}`, {
        method: "DELETE",
        headers: { 
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json" 
        }
      });

      if (!res.ok) throw new Error("Gagal menghapus");

      toast.success("Artikel dihapus", { id: toastId });
      fetchNews();
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  return (
    <div className="font-sans">
        
        {/* --- VIEW LIST --- */}
        {view === "list" && (
            <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h3 className="font-bold text-gray-800 text-lg">Daftar Artikel & Berita</h3>
                    <button 
                        onClick={() => toggleForm(true)} 
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition flex items-center gap-2 shadow-sm"
                    >
                        <span>+</span> Tulis Artikel
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="p-4 border-b border-gray-100">Judul Artikel</th>
                                <th className="p-4 border-b border-gray-100">Status</th>
                                <th className="p-4 border-b border-gray-100">Tanggal</th>
                                <th className="p-4 border-b border-gray-100 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan="4" className="p-8 text-center text-gray-400">Memuat artikel...</td></tr>
                            ) : newsList.length > 0 ? (
                                newsList.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition">
                                        <td className="p-4 font-bold text-gray-800 w-1/2">
                                            <div className="line-clamp-2">{item.title}</div>
                                        </td>
                                        <td className="p-4">
                                            {item.is_important ? (
                                                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-[10px] font-bold border border-red-200">HOT NEWS</span>
                                            ) : (
                                                <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-[10px] font-bold border border-gray-200">Reguler</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-xs text-gray-500">
                                            {new Date(item.created_at).toLocaleDateString("id-ID")}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => toggleForm(true, item)}
                                                className="bg-blue-50 text-blue-600 p-2 rounded-md hover:bg-blue-600 hover:text-white mr-2 transition"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="bg-red-50 text-red-600 p-2 rounded-md hover:bg-red-600 hover:text-white transition"
                                            >
                                                🗑
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center text-gray-400 flex flex-col items-center justify-center">
                                        <span className="text-4xl mb-2">📰</span>
                                        <p>Belum ada artikel.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* --- VIEW FORM --- */}
        {view === "form" && (
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800 text-xl">
                        {isEditing ? "Edit Artikel" : "Tulis Artikel Baru"}
                    </h3>
                    <button 
                        onClick={() => toggleForm(false)}
                        className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition"
                    >
                        Kembali
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Judul */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Judul Artikel</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-green-500 outline-none transition font-bold text-gray-800" placeholder="Judul yang menarik..." />
                    </div>

                    {/* Thumbnail URL */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">URL Gambar Cover</label>
                        <input type="text" name="thumbnail" value={formData.thumbnail} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-green-500 outline-none transition" placeholder="https://..." />
                    </div>

                    {/* Konten */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Isi Artikel</label>
                        <textarea 
                            name="content" 
                            value={formData.content} 
                            onChange={handleChange} 
                            required 
                            rows="12" 
                            className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:border-green-500 outline-none transition leading-relaxed" 
                            placeholder="Mulai menulis cerita atau tips di sini..."
                        ></textarea>
                    </div>

                    {/* Opsi Hot News */}
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input 
                                type="checkbox" 
                                name="is_important" 
                                checked={formData.is_important} 
                                onChange={handleChange} 
                                className="w-5 h-5 accent-red-600 rounded cursor-pointer" 
                            />
                            <div>
                                <span className="block text-sm font-bold text-red-800">Jadikan Hot News / Penting?</span>
                                <span className="text-xs text-red-600">Artikel ini akan muncul di banner besar halaman utama.</span>
                            </div>
                        </label>
                    </div>

                    {/* Tombol Simpan */}
                    <div className="text-right border-t border-gray-100 pt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => toggleForm(false)} className="px-6 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition">Batal</button>
                        <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition">
                            {isEditing ? "Simpan Perubahan" : "Terbitkan Artikel"}
                        </button>
                    </div>
                </form>
            </div>
        )}

    </div>
  );
}