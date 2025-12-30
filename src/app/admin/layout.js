"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminName, setAdminName] = useState("Admin");

  // Proteksi Halaman
  useEffect(() => {
    const role = localStorage.getItem("role");
    const userString = localStorage.getItem("user");

    if (!role || role !== "admin") {
      toast.error("Akses ditolak! Anda bukan Admin.");
      router.push("/");
    } else {
      if (userString) {
        const user = JSON.parse(userString);
        setAdminName(user.name);
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logout berhasil.");
    router.push("/login");
  };

  // Helper Link Aktif
  const isActive = (path) => pathname.startsWith(path);

  // Helper Class untuk Link Sidebar
  const getLinkClass = (path) => {
    return `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
      isActive(path) 
        ? 'bg-green-50 text-primary font-bold border-r-4 border-primary' 
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
    }`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans text-gray-800">
      
      {/* --- SIDEBAR KIRI --- */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full hidden md:flex flex-col z-10">
        
        {/* Header Sidebar */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <div className="w-25 h-25 rounded-xl flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">
              <img 
                src="/logo.png" 
                alt="Logo Pendakian Bali" 
                className="w-full h-full object-contain p-1" 
              />
            </div>
          <div>
            <h1 className="font-bold text-gray-800 tracking-tight leading-none text-lg">Mountain<span className="text-primary">CMS</span></h1>
            <p className="text-[10px] text-gray-400 mt-1">v1.0.0 Panel Admin</p>
          </div>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
          
          {/* GROUP 1: OVERVIEW */}
          <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2">Overview</p>
          
          <Link href="/admin/dashboard" className={getLinkClass('/admin/dashboard')}>
            <span className="w-5 text-center">📊</span> Dashboard
          </Link>

          {/* GROUP 2: MASTER DATA */}
          <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6">Master Content</p>
          
          <Link href="/admin/mountains" className={getLinkClass('/admin/mountains')}>
            <span className="w-5 text-center">🏔</span> Data Gunung
          </Link>
          
          <Link href="/admin/news" className={getLinkClass('/admin/news')}>
            <span className="w-5 text-center">📰</span> Berita & Tips
          </Link>

        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-white border border-gray-200 hover:bg-red-50 hover:border-red-100 transition shadow-sm">
            <span>🚪</span> Keluar
          </button>
        </div>
      </aside>

      {/* --- KONTEN KANAN --- */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* Header Desktop & Mobile */}
        <header className="bg-white border-b border-gray-200 py-4 px-6 md:px-8 flex justify-between items-center sticky top-0 z-20 shadow-sm backdrop-blur-md">
            <div>
                <h2 className="text-lg font-bold text-gray-800 capitalize">
                    {/* Logika Judul Header Dinamis */}
                    {pathname.includes('dashboard') ? 'Dashboard Overview' : 
                     pathname.includes('mountains') ? 'Kelola Database Gunung' : 
                     pathname.includes('news') ? 'Kelola Artikel & Berita' : 
                     pathname.includes('users') ? 'Manajemen Pengguna' :
                     pathname.includes('settings') ? 'Pengaturan Sistem' : 'Admin Panel'}
                </h2>
                <p className="text-xs text-gray-400 hidden md:block">Kelola konten dan pantau aktivitas aplikasi di sini.</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-gray-800">{adminName}</p>
                    <p className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full inline-block">Super Admin</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shadow-md border-2 border-green-100">
                    {adminName.charAt(0)}
                </div>
            </div>
        </header>

        {/* Area Konten Utama */}
        <main className="p-6 md:p-8">
            {children}
        </main>

      </div>
    </div>
  );
}