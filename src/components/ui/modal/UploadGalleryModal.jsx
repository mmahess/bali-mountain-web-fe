"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios"; // Pastikan sudah install axios (npm install axios)

export default function UploadGalleryModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const MAX_FILE_SIZE_MB = 10; 

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    
    if (selected) {
      // Validasi Ukuran di Client agar user tidak menunggu upload lama lalu gagal
      if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        return toast.error(`Ukuran file terlalu besar! Maksimal ${MAX_FILE_SIZE_MB}MB.`);
      }

      setFile(selected);
      setPreview(URL.createObjectURL(selected)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Pilih foto dulu!");

    // Cek caption (Karena di Backend 'caption' => 'required')
    if (!caption.trim()) {
        return toast.error("Caption wajib diisi!");
    }

    setIsLoading(true);
    const toastId = toast.loading("Mengupload foto...");

    try {
      const token = localStorage.getItem("token");
      
      // Gunakan FormData untuk upload file
      const formData = new FormData();
      formData.append("image", file);
      formData.append("caption", caption);

      // Kirim menggunakan AXIOS
      // Axios otomatis mengatur header 'Content-Type': 'multipart/form-data'
      await axios.post("http://localhost:8000/api/galleries", formData, {
        headers: { 
            "Authorization": `Bearer ${token}` 
        }
      });

      toast.success("Foto berhasil diposting!", { id: toastId });
      
      // Reset State
      setFile(null);
      setPreview(null);
      setCaption("");
      
      onSuccess(); // Refresh data di halaman belakang
      onClose();   // Tutup modal

    } catch (error) {
      console.error(error);
      
      // --- PENANGANAN ERROR VALIDASI (422) ---
      if (error.response && error.response.status === 422) {
         const validationErrors = error.response.data.errors;
         
         // Ambil pesan error pertama dari backend
         if (validationErrors.image) {
             toast.error(validationErrors.image[0], { id: toastId });
         } else if (validationErrors.caption) {
             toast.error(validationErrors.caption[0], { id: toastId });
         } else {
             toast.error("Data tidak valid.", { id: toastId });
         }
      } else {
         // Error Server / Jaringan Lainnya
         toast.error(error.response?.data?.message || "Gagal mengupload", { id: toastId });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Upload Momen 📸</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-red-500 font-bold text-xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
            
            {/* Area Preview / Input */}
            <div className="mb-4">
                {preview ? (
                    <div className="relative rounded-xl overflow-hidden aspect-square bg-gray-100 mb-3">
                        <img src={preview} className="w-full h-full object-cover" />
                        <button 
                            type="button" 
                            onClick={() => { setFile(null); setPreview(null); }}
                            className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition"
                        >
                            🗑
                        </button>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <span className="text-4xl mb-2 group-hover:scale-110 transition">☁️</span>
                            <p className="mb-2 text-sm text-gray-500 font-bold">Klik untuk upload foto</p>
                            {/* Update Info sesuai Backend */}
                            <p className="text-xs text-gray-400">PNG, JPG (Max {MAX_FILE_SIZE_MB}MB)</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                )}
            </div>

            {/* Caption */}
            <div className="mb-4">
                {/* Update Label: Hilangkan 'Opsional' karena di backend required */}
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Caption <span className="text-red-500">*</span></label>
                <textarea 
                    rows="2"
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-green-500 outline-none transition"
                    placeholder="Ceritakan sedikit tentang foto ini..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                ></textarea>
            </div>

            <button 
                type="submit" 
                disabled={isLoading || !file}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mengupload...
                    </span>
                ) : "Posting Foto"}
            </button>

        </form>
      </div>
    </div>
  );
}