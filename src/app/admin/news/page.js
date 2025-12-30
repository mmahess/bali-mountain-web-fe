"use client";

import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import dynamic from 'next/dynamic';

// --- IMPORT CSS DARI REACT-QUILL-NEW ---
import 'react-quill-new/dist/quill.snow.css'; 

// --- IMPORT EDITOR SECARA DYNAMIC (NO SSR) ---
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function AdminNewsPage() {
  const [view, setView] = useState("list"); 
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State Form
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // State Gambar Baru
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Tips",
    content: "",
    is_important: false
    // thumbnail tidak di sini lagi, tapi di imageFile
  });

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'clean']
    ],
  }), []);

  // 1. Fetch Data
  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news`, { cache: 'no-store' });
      const json = await res.json();
      
      const hot = json.data.hotNews ? [json.data.hotNews] : [];
      const allNews = [...hot, ...json.data.latestNews];
      
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

  // 2. Handle Input Biasa
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 3. Handle File Gambar (Thumbnail)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 4. Handle Editor
  const handleContentChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  // 5. Reset Form
  const toggleForm = (show, data = null) => {
    if (show) {
      if (data) {
        setIsEditing(true);
        setEditId(data.id);
        setFormData({
            title: data.title || "",
            category: data.category || "Tips",
            content: data.content || "", 
            is_important: data.is_important ? true : false
        });
        // Tampilkan thumbnail lama
        const imgUrl = data.thumbnail ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${data.thumbnail}` : null;
        setImagePreview(imgUrl);
        setImageFile(null);
      } else {
        setIsEditing(false);
        setEditId(null);
        setFormData({ 
            title: "", category: "Tips", content: "", is_important: false 
        });
        setImagePreview(null);
        setImageFile(null);
      }
      setView("form");
    } else {
      setView("list");
    }
  };

  // 6. Submit dengan FormData
  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Menyimpan artikel...");
    
    try {
      const token = localStorage.getItem("token");
      
      // Gunakan FormData untuk support file
      const dataToSend = new FormData();
      dataToSend.append("title", formData.title);
      dataToSend.append("category", formData.category);
      dataToSend.append("content", formData.content);
      dataToSend.append("is_important", formData.is_important ? '1' : '0');

      if (imageFile) {
          dataToSend.append("thumbnail", imageFile);
      }

      // Trik Laravel Method PUT
      if (isEditing) {
          dataToSend.append("_method", "PUT");
      }

      const url = isEditing 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/news/${editId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/news`;
      
      const res = await fetch(url, {
        method: "POST", // Selalu POST jika FormData
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: dataToSend
      });

      if (!res.ok) throw new Error("Gagal menyimpan artikel");

      toast.success(isEditing ? "Artikel diperbarui!" : "Artikel diterbitkan!", { id: toastId });
      fetchNews();
      toggleForm(false);

    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan data", { id: toastId });
    }
  };

  // 7. Delete
  const handleDelete = async (id) => {
    if(!confirm("Hapus artikel ini?")) return;
    
    const toastId = toast.loading("Menghapus...");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news/${id}`, {
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
      toast.error("Gagal menghapus", { id: toastId });
    }
  };

  return (
    <div className="font-sans">
        
        {/* LIST VIEW */}
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
                                <th className="p-4 border-b border-gray-100">Cover</th>
                                <th className="p-4 border-b border-gray-100">Judul Artikel</th>
                                <th className="p-4 border-b border-gray-100">Kategori</th>
                                <th className="p-4 border-b border-gray-100">Status</th>
                                <th className="p-4 border-b border-gray-100 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
                            {newsList.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        <img 
                                            src={item.thumbnail ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${item.thumbnail}` : "https://placehold.co/100"} 
                                            className="w-12 h-12 rounded object-cover bg-gray-200"
                                        />
                                    </td>
                                    <td className="p-4 font-bold text-gray-800 w-1/3">
                                        <div className="line-clamp-2">{item.title}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[10px] font-bold border border-blue-100">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {item.is_important && (
                                            <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-[10px] font-bold border border-red-100">HOT</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => toggleForm(true, item)} className="text-blue-600 font-bold mr-3 hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-600 font-bold hover:underline">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* FORM VIEW */}
        {view === "form" && (
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800 text-xl">
                        {isEditing ? "Edit Artikel" : "Tulis Artikel Baru"}
                    </h3>
                    <button onClick={() => toggleForm(false)} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition">Kembali</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* INPUT GAMBAR THUMBNAIL */}
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Thumbnail / Cover</label>
                        <div className="flex items-center gap-6">
                            <div className="w-32 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                                {imagePreview ? (
                                    <img src={imagePreview} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xs text-gray-400">No Image</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                                />
                                <p className="text-xs text-gray-400 mt-1 ml-1">Format: JPG, PNG. Max 2MB.</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Judul Artikel</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-green-500 outline-none transition font-bold text-gray-800" />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Kategori</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-green-500 outline-none bg-white transition">
                                <option value="Tips">Tips & Trik</option>
                                <option value="Review">Review Gear</option>
                                <option value="Info Jalur">Info Jalur</option>
                                <option value="Event">Event</option>
                                <option value="Cerita">Cerita Pendaki</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Isi Artikel</label>
                        <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                            <ReactQuill 
                                theme="snow" 
                                value={formData.content} 
                                onChange={handleContentChange} 
                                modules={modules}
                                className="h-64 mb-12"
                            />
                        </div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 mt-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" name="is_important" checked={formData.is_important} onChange={handleChange} className="w-5 h-5 accent-red-600 rounded cursor-pointer" />
                            <div>
                                <span className="block text-sm font-bold text-red-800">Jadikan Hot News / Penting?</span>
                                <span className="text-xs text-red-600">Artikel ini akan muncul di banner besar halaman utama.</span>
                            </div>
                        </label>
                    </div>

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