"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export const dynamic = 'force-dynamic';

export default function AdminMountainsPage() {
  const [view, setView] = useState("list"); // 'list' | 'form'
  const [mountains, setMountains] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State Form
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // State Gambar (Baru)
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
    map_iframe_url: ""
    // cover_image dihapus dari sini karena dikelola state imageFile
  });

  // 1. Fetch Data
  const fetchMountains = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mountains`, { cache: 'no-store' });
      const json = await res.json();
      setMountains(json.data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMountains();
  }, []);

  // 2. Handle Text Input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 3. Handle File Input (Gambar)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file)); // Preview lokal
    }
  };
  
  // 4. Reset Form & Switch View
  const toggleForm = (show, data = null) => {
    if (show) {
      if (data) {
        // Mode Edit
        setIsEditing(true);
        setEditId(data.id);
        setFormData({
            name: data.name || "",
            location: data.location || "",
            elevation: data.elevation || "",
            elevation_gain: data.elevation_gain || "", 
            difficulty_level: data.difficulty_level || "medium",
            distance: data.distance || "",
            estimation_time: data.estimation_time || "",
            starting_point: data.starting_point || "",
            ticket_price: data.ticket_price || "",
            is_guide_required: Boolean(data.is_guide_required),
            description: data.description || "",
            map_iframe_url: data.map_iframe_url || ""
        });
        // Tampilkan gambar lama dari server
        const imgUrl = data.cover_image ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${data.cover_image}` : null;
        setImagePreview(imgUrl);
        setImageFile(null);
      } else {
        // Mode Tambah (Reset)
        setIsEditing(false);
        setEditId(null);
        setFormData({
            name: "", location: "", elevation: "", elevation_gain: "", 
            difficulty_level: "medium", distance: "", estimation_time: "", 
            starting_point: "", ticket_price: "", is_guide_required: false,
            description: "", map_iframe_url: ""
        });
        setImagePreview(null);
        setImageFile(null);
      }
      setView("form");
    } else {
      setView("list");
    }
  };

  // 5. Submit dengan FormData (PENTING)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Mengupload data...");
    
    try {
      const token = localStorage.getItem("token");
      
      // Gunakan FormData untuk support file upload
      const dataToSend = new FormData();
      
      // Masukkan semua data teks
      Object.keys(formData).forEach(key => {
          // Convert boolean ke string "1" atau "0" untuk PHP
          if (typeof formData[key] === 'boolean') {
              dataToSend.append(key, formData[key] ? '1' : '0');
          } else {
              dataToSend.append(key, formData[key]);
          }
      });

      // Masukkan File jika ada
      if (imageFile) {
          dataToSend.append("cover_image", imageFile);
      }

      // Trik untuk Method PUT di Laravel saat ada file
      if (isEditing) {
          dataToSend.append("_method", "PUT");
      }

      // Tentukan URL. Gunakan POST untuk kedua kasus (karena trik _method PUT)
      const url = isEditing 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/mountains/${editId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/mountains`;

      const res = await fetch(url, {
        method: "POST", // Selalu POST jika FormData
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
          // JANGAN SET Content-Type manually!
        },
        body: dataToSend
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal menyimpan data");
      }

      toast.success(isEditing ? "Data diperbarui!" : "Gunung berhasil ditambahkan!", { id: toastId });
      fetchMountains(); // Refresh tabel
      toggleForm(false); // Tutup form

    } catch (error) {
      console.error(error);
      toast.error(error.message, { id: toastId });
    }
  };

  const handleDelete = async (id) => {
    if(!confirm("Hapus data ini?")) return;
    const toastId = toast.loading("Menghapus...");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mountains/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Gagal hapus");
      toast.success("Terhapus", { id: toastId });
      fetchMountains();
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  return (
    <div className="font-sans">
        
        {/* LIST VIEW */}
        {view === "list" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 text-lg">Database Gunung</h3>
                    <button onClick={() => toggleForm(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition flex items-center gap-2">
                        <span>+</span> Tambah Data
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-xs font-bold uppercase">
                            <tr>
                                <th className="p-4">Cover</th>
                                <th className="p-4">Nama Gunung</th>
                                <th className="p-4">Lokasi</th>
                                <th className="p-4">Tinggi</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
                            {mountains.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <img 
                                            src={item.cover_image ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${item.cover_image}` : "https://placehold.co/100"} 
                                            className="w-10 h-10 rounded object-cover bg-gray-200"
                                        />
                                    </td>
                                    <td className="p-4 font-bold">{item.name}</td>
                                    <td className="p-4">{item.location}</td>
                                    <td className="p-4">{item.elevation} mdpl</td>
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
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                    <h3 className="font-bold text-xl">{isEditing ? "Edit Gunung" : "Tambah Gunung"}</h3>
                    <button onClick={() => toggleForm(false)} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold">Batal</button>
                </div>

                <form onSubmit={handleSubmit}>
                    
                    {/* BAGIAN FOTO COVER (DIUBAH JADI FILE INPUT) */}
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Foto Cover</label>
                        <div className="flex items-center gap-6">
                            {/* Preview Box */}
                            <div className="w-32 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                                {imagePreview ? (
                                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview"/>
                                ) : (
                                    <span className="text-xs text-gray-400">No Image</span>
                                )}
                            </div>
                            
                            {/* Input File */}
                            <div className="flex-1">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                                />
                                <p className="text-xs text-gray-400 mt-1 ml-1">Format: JPG, PNG. Max 5MB.</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* INPUT TEKS DENGAN PLACEHOLDER TETAP ADA */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nama Gunung</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input-field" placeholder="Contoh: Gunung Kerinci" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Lokasi</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} required className="input-field" placeholder="Jambi, Sumatera" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Ketinggian (mdpl)</label>
                                <input type="number" name="elevation" value={formData.elevation} onChange={handleChange} required className="input-field" placeholder="3726" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Elevasi Gain (m)</label>
                                <input type="number" name="elevation_gain" value={formData.elevation_gain} onChange={handleChange} required className="input-field" placeholder="1200" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Kesulitan</label>
                            <select name="difficulty_level" value={formData.difficulty_level} onChange={handleChange} className="input-field bg-white">
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Jarak (KM)</label>
                                <input type="number" step="0.1" name="distance" value={formData.distance} onChange={handleChange} required className="input-field" placeholder="12.5" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Estimasi Waktu</label>
                                <input type="text" name="estimation_time" value={formData.estimation_time} onChange={handleChange} required className="input-field" placeholder="6-8 Jam" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Harga Tiket</label>
                            <input type="number" name="ticket_price" value={formData.ticket_price} onChange={handleChange} required className="input-field" placeholder="15000" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Starting Point</label>
                            <input type="text" name="starting_point" value={formData.starting_point} onChange={handleChange} required className="input-field" placeholder="Basecamp..." />
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                                <input type="checkbox" name="is_guide_required" checked={formData.is_guide_required} onChange={handleChange} className="w-5 h-5 accent-green-600" />
                                <span className="text-sm font-bold">Wajib Guide?</span>
                            </label>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Deskripsi</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="input-field" placeholder="Jelaskan kondisi medan, sumber air, dll..."></textarea>
                    </div>

                    <div className="mb-8">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">URL Peta (Opsional)</label>
                        <input type="text" name="map_iframe_url" value={formData.map_iframe_url} onChange={handleChange} className="input-field" placeholder="Link embed gpx.studio atau google maps..." />
                    </div>

                    <div className="text-right border-t pt-6">
                        <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg transition">
                            {isEditing ? "Simpan Perubahan" : "Simpan Data"}
                        </button>
                    </div>
                </form>
            </div>
        )}

        <style jsx>{`
            .input-field {
                width: 100%;
                border: 1px solid #e5e7eb;
                border-radius: 0.75rem;
                padding: 0.75rem 1rem;
                font-size: 0.875rem;
                outline: none;
                transition: all 0.2s;
            }
            .input-field:focus {
                border-color: #16a34a;
                box-shadow: 0 0 0 1px #16a34a;
            }
        `}</style>
    </div>
  );
}