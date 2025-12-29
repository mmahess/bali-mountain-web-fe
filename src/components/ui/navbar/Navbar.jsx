"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast"; // 1. Pastikan import ini ada

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Hapus data session
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    
    setUser(null);
    setIsDropdownOpen(false);
    
    // 2. GANTI ALERT DENGAN TOASTER DI SINI
    toast.success("Berhasil Logout. Sampai jumpa!", {
        icon: '👋',
        style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
        },
    });
    
    router.push("/login");
  };

  // ... (Sisa kode Navbar ke bawah sama persis, tidak perlu diubah) ...
  
  // Helper cek link aktif
  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const getLinkClass = (path) => {
    return isActive(path) ? "text-primary font-bold" : "hover:text-primary transition";
  };

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-lg shadow-green-100">
            MG
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">MuncakGunung</span>
        </Link>

        <div className="hidden md:flex gap-8 font-medium text-sm text-gray-500">
          <Link href="/" className={getLinkClass("/")}>Beranda</Link>
          <Link href="/gunung" className={getLinkClass("/gunung")}>Katalog Gunung</Link>
          <Link href="/komunitas" className={getLinkClass("/komunitas")}>Komunitas</Link>
          <Link href="/berita" className={getLinkClass("/berita")}>Berita</Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 hover:bg-gray-50 p-1 pr-3 rounded-full transition border border-transparent hover:border-gray-200"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                  <img 
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-gray-800 line-clamp-1">{user.name}</p>
                  <p className="text-[10px] text-gray-500 capitalize">{user.role}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-200">
                  {user.role === 'admin' && (
                    <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary font-medium">
                      📊 Dashboard Admin
                    </Link>
                  )}
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary font-medium">
                    👤 Profil Saya
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold flex items-center gap-2"
                  >
                    🚪 Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-primary px-4 py-2">Masuk</Link>
              <Link href="/register" className="bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-green-700 transition shadow-xl shadow-green-200">Daftar Akun</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}