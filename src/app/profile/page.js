"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import FrontpageLayout from "@/components/layouts/FrontpageLayout";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("biodata"); // 'biodata' | 'password'

  // Form States
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  // Password States
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setName(parsedUser.name);
      setAvatarPreview(parsedUser.avatar);
    }
  }, []);

  // --- HANDLER UPDATE PROFIL ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Menyimpan perubahan...");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", name);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      // Pastikan URL API sesuai dengan Laravel kamu
      const res = await axios.post("http://127.0.0.1:8000/api/profile/update", formData, {
        headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data" 
        }
      });

      // Update LocalStorage & State
      const updatedUser = res.data.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success("Profil berhasil diperbarui!", { id: toastId });
      
      // Refresh halaman (opsional) atau update navbar secara real-time via context (kalau ada)
      window.dispatchEvent(new Event("storage")); // Trigger event storage agar navbar update (kalo pake listener)
      
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Gagal update profil", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  // --- HANDLER GANTI PASSWORD ---
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
        return toast.error("Konfirmasi password tidak cocok!");
    }
    
    setIsLoading(true);
    const toastId = toast.loading("Mengganti password...");

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://127.0.0.1:8000/api/profile/password", {
        current_password: passwords.current,
        new_password: passwords.new,
        new_password_confirmation: passwords.confirm
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Password berhasil diubah!", { id: toastId });
      setPasswords({ current: "", new: "", confirm: "" }); // Reset form
      
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Gagal ganti password", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  if (!user) return null; // Atau loading spinner

  return (
    <FrontpageLayout>
      <div className="min-h-screen bg-bg-soft py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
            
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Pengaturan Profil</h1>

            <div className="flex flex-col md:flex-row gap-8">
                
                {/* --- SIDEBAR MENU --- */}
                <aside className="w-full md:w-64 shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <button 
                            onClick={() => setActiveTab("biodata")}
                            className={`w-full text-left px-6 py-4 text-sm font-bold border-b border-gray-50 hover:bg-gray-50 transition flex items-center gap-3 ${activeTab === 'biodata' ? 'text-primary bg-green-50 border-l-4 border-l-primary' : 'text-gray-600'}`}
                        >
                            <span>👤</span> Biodata Diri
                        </button>
                        <button 
                            onClick={() => setActiveTab("password")}
                            className={`w-full text-left px-6 py-4 text-sm font-bold hover:bg-gray-50 transition flex items-center gap-3 ${activeTab === 'password' ? 'text-primary bg-green-50 border-l-4 border-l-primary' : 'text-gray-600'}`}
                        >
                            <span>🔒</span> Ganti Password
                        </button>
                    </div>
                </aside>

                {/* --- KONTEN FORM --- */}
                <div className="flex-1">
                    
                    {/* TAB BIODATA */}
                    {activeTab === "biodata" && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Edit Biodata</h2>
                            
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                
                                {/* Avatar Upload */}
                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-md relative group">
                                        <img 
                                            src={avatarPreview || `https://ui-avatars.com/api/?name=${user.name}`} 
                                            alt="Avatar" 
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Overlay Hover */}
                                        <label className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition cursor-pointer">
                                            <span className="text-xs font-bold">Ubah</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Foto Profil</p>
                                        <p className="text-xs text-gray-500 mb-2">Format: JPG, PNG (Max 5MB)</p>
                                        <label className="text-xs font-bold text-primary border border-primary px-3 py-1.5 rounded-lg cursor-pointer hover:bg-primary hover:text-white transition">
                                            Pilih Foto
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                </div>

                                {/* Input Nama */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                {/* Input Email (Disabled) */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Alamat Email</label>
                                    <input 
                                        type="email" 
                                        className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
                                        value={user.email}
                                        disabled
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">*Email tidak dapat diubah.</p>
                                </div>

                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="bg-primary text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-green-200 hover:bg-green-700 transition disabled:opacity-50"
                                    >
                                        {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* TAB PASSWORD */}
                    {activeTab === "password" && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Ganti Password</h2>
                            
                            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Password Saat Ini</label>
                                    <input 
                                        type="password" 
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                                        value={passwords.current}
                                        onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Password Baru</label>
                                    <input 
                                        type="password" 
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Konfirmasi Password Baru</label>
                                    <input 
                                        type="password" 
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                    />
                                </div>

                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="bg-primary text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-green-200 hover:bg-green-700 transition disabled:opacity-50"
                                    >
                                        {isLoading ? "Memproses..." : "Update Password"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </div>
      </div>
    </FrontpageLayout>
  );
}