"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function AdminMountainsPage() {
  const [view, setView] = useState("list"); // 'list' | 'form'
  const [mountains, setMountains] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State Form
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    elevation: "",
    elevation_gain: "",
    difficulty_level: "medium",
    distance: "",
    estimation_time: "",
    starting_point: "",
    ticket_price: "",
    is_guide_required: false,
    description: "",
    cover_image: "",
    map_iframe_url: ""
  });

  // 1. Fetch Data Gunung
  const fetchMountains = async () => {
    setIsLoading(true);
    try {
      // Fetch public API (karena kita set index public di controller)
      // Atau gunakan endpoint admin jika Anda membuatnya secure
      const res = await fetch("http://127.0.0.1:8000/api/mountains", {
        cache: 'no-store'
      });
      const json = await res.json();
      setMountains(json.data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data gunung");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMountains();
  }, []);

  // 2. Handle Input Form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  
  // 3. Reset Form & Switch View
  const toggleForm = (show, data = null) => {
    if (show) {
      if (data) {
        // Mode Edit
        setIsEditing(true);
        setEditId(data.id);
        setFormData({
            // Tambahkan || "" di setiap field untuk mencegah error Uncontrolled Input
            name: data.name || "",
            location: data.location || "",
            elevation: data.elevation || "",
            elevation_gain: data.elevation_gain || "", 
            difficulty_level: data.difficulty_level || "medium",
            distance: data.distance || "",
            estimation_time: data.estimation_time || "",
            starting_point: data.starting_point || "",
            ticket_price: data.ticket_price || "",
            is_guide_required: data.is_guide_required ? true : false, // Pastikan boolean
            description: data.description || "",
            cover_image: data.cover_image || "",
            map_iframe_url: data.map_iframe_url || ""
        });
      } else {
        // Mode Tambah Baru (Reset)
        setIsEditing(false);
        setEditId(null);
        setFormData({
            name: "", location: "", 
            elevation: "", elevation_gain: "", 
            difficulty_level: "medium", distance: "", 
            estimation_time: "", 
            starting_point: "", ticket_price: "", 
            is_guide_required: false,
            description: "", cover_image: "", map_iframe_url: ""
        });
      }
      setView("form");
    } else {
      setView("list");
    }
  };

  // 4. Submit Data (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Menyimpan data...");
    
    try {
      const token = localStorage.getItem("token");
      const url = isEditing 
        ? `http://127.0.0.1:8000/api/mountains/${editId}`
        : "http://127.0.0.1:8000/api/mountains";
      
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

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal menyimpan data");
      }

      toast.success(isEditing ? "Data berhasil diperbarui!" : "Gunung berhasil ditambahkan!", { id: toastId });
      fetchMountains(); // Refresh tabel
      toggleForm(false); // Kembali ke tabel

    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  // 5. Delete Data
  const handleDelete = async (id) => {
    if(!confirm("Yakin ingin menghapus gunung ini? Data tidak bisa dikembalikan.")) return;
    
    const toastId = toast.loading("Menghapus...");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/api/mountains/${id}`, {
        method: "DELETE",
        headers: { 
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
        }
      });

      if (!res.ok) throw new Error("Gagal menghapus data");

      toast.success("Gunung berhasil dihapus", { id: toastId });
      fetchMountains();
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  return (
    <div className="font-sans">
        
        {/* --- VIEW LIST (TABLE) --- */}
        {view === "list" && (
            <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h3 className="font-bold text-gray-800 text-lg">Database Gunung</h3>
                    <button 
                        onClick={() => toggleForm(true)} 
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition flex items-center gap-2 shadow-sm"
                    >
                        <span>+</span> Tambah Data
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="p-4 border-b border-gray-100">Nama Gunung</th>
                                <th className="p-4 border-b border-gray-100">Lokasi</th>
                                <th className="p-4 border-b border-gray-100">Tinggi</th>
                                <th className="p-4 border-b border-gray-100">Kesulitan</th>
                                <th className="p-4 border-b border-gray-100 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-400">Memuat data...</td></tr>
                            ) : mountains.length > 0 ? (
                                mountains.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition">
                                        <td className="p-4 font-bold text-gray-800">{item.name}</td>
                                        <td className="p-4">{item.location}</td>
                                        <td className="p-4">{item.elevation} mdpl</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                                                item.difficulty_level === 'hard' ? 'bg-red-50 text-red-600 border-red-100' : 
                                                item.difficulty_level === 'medium' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-green-50 text-green-600 border-green-100'
                                            }`}>
                                                {item.difficulty_level}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => toggleForm(true, item)}
                                                className="bg-blue-50 text-blue-600 p-2 rounded-md hover:bg-blue-600 hover:text-white mr-2 transition" 
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="bg-red-50 text-red-600 p-2 rounded-md hover:bg-red-600 hover:text-white transition" 
                                                title="Hapus"
                                            >
                                                🗑
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-gray-400 flex flex-col items-center justify-center">
                                        <span className="text-4xl mb-2">🏔</span>
                                        <p>Belum ada data gunung.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* --- VIEW FORM (ADD / EDIT) --- */}
        {view === "form" && (
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800 text-xl">
                        {isEditing ? "Edit Data Gunung" : "Tambah Gunung Baru"}
                    </h3>
                    <button 
                        onClick={() => toggleForm(false)}
                        className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition"
                    >
                        Kembali
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Nama */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Nama Gunung</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-green-500 outline-none transition" placeholder="Contoh: Gunung Kerinci" />
                        </div>
                        {/* Lokasi */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Lokasi (Provinsi)</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-green-500 outline-none transition" placeholder="Jambi, Sumatera" />
                        </div>
                        
                        {/* --- UPDATE BAGIAN INI: Ketinggian & Elevasi Gain --- */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Ketinggian (mdpl)</label>
                                <input type="number" name="elevation" value={formData.elevation} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-green-500 outline-none transition" placeholder="3726" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Elevasi Gain (m)</label>
                                <input type="number" name="elevation_gain" value={formData.elevation_gain} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-green-500 outline-none transition" placeholder="1200" />
                            </div>
                        </div>

                        {/* Kesulitan */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Tingkat Kesulitan</label>
                            <select name="difficulty_level" value={formData.difficulty_level} onChange={handleChange} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-green-500 outline-none bg-white transition">
                                <option value="easy">Easy (Pemula)</option>
                                <option value="medium">Medium (Menengah)</option>
                                <option value="hard">Hard (Sulit)</option>
                            </select>
                        </div>

                        {/* Starting Point */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Starting Point</label>
                            <input type="text" name="starting_point" value={formData.starting_point} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-green-500 outline-none transition" placeholder="Basecamp..." />
                        </div>

                        {/* --- UPDATE BAGIAN INI: Jarak & Estimasi Waktu --- */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Jarak (KM)</label>
                                <input type="number" step="0.1" name="distance" value={formData.distance} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-green-500 outline-none transition" placeholder="12.5" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Estimasi Waktu</label>
                                <input type="text" name="estimation_time" value={formData.estimation_time} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-green-500 outline-none transition" placeholder="6-8 Jam" />
                            </div>
                        </div>

                        {/* Harga Tiket */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Harga Tiket (Rp)</label>
                            <input type="number" name="ticket_price" value={formData.ticket_price} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-green-500 outline-none transition" placeholder="15000" />
                        </div>

                        {/* URL Foto */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">URL Foto Cover</label>
                            <input type="text" name="cover_image" value={formData.cover_image} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-green-500 outline-none transition" placeholder="https://..." />
                        </div>

                        {/* --- TAMBAHAN BARU: Checkbox Guide --- */}
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-xl w-full hover:bg-gray-50 transition bg-white">
                                <input 
                                    type="checkbox" 
                                    name="is_guide_required" 
                                    checked={formData.is_guide_required} 
                                    onChange={handleChange} 
                                    className="w-5 h-5 accent-green-600 rounded cursor-pointer" 
                                />
                                <div>
                                    <span className="block text-sm font-bold text-gray-800">Wajib Menggunakan Guide?</span>
                                    <span className="text-xs text-gray-500">Centang jika peraturan gunung mewajibkan pendaki menyewa pemandu (guide/porter).</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Deskripsi Lengkap</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required rows="5" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-green-500 outline-none transition" placeholder="Jelaskan kondisi medan, sumber air, dll..."></textarea>
                    </div>

                    {/* URL Map */}
                    <div className="mb-8">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">URL Iframe Peta (Opsional)</label>
                        <input type="text" name="map_iframe_url" value={formData.map_iframe_url} onChange={handleChange} className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-green-500 outline-none transition" placeholder="Link embed gpx.studio atau google maps..." />
                    </div>

                    {/* Tombol Simpan */}
                    <div className="text-right border-t border-gray-100 pt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => toggleForm(false)} className="px-6 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition">Batal</button>
                        <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition">
                            {isEditing ? "Simpan Perubahan" : "Simpan Data"}
                        </button>
                    </div>
                </form>
            </div>
        )}

    </div>
  );
}