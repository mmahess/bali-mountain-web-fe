"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; 
import toast from "react-hot-toast";

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  // State Statistik
  const [stats, setStats] = useState({
    mountains: 0,
    users: 0,
    trips: 0,
    news: 0,
    posts: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        // Pastikan endpoint API ini benar sesuai route Laravel Anda
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        if (!res.ok) throw new Error("Gagal mengambil data");
        const json = await res.json();
        setStats(json.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
        
        {/* 1. WELCOME BANNER */}
        <div className="bg-linear-to-r from-green-800 to-green-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
            <div className="relative z-10 max-w-2xl">
                {/* Perbaikan Typo: tsext-3xl -> text-3xl */}
                <h2 className="text-3xl font-bold mb-2">Halo, Admin! 👋</h2>
                <p className="text-green-100 text-sm leading-relaxed mb-6">
                    Selamat datang di panel kontrol SobatMuncak. Saat ini terdapat <b>{stats.mountains} data gunung,</b> dan komunitas terus bertumbuh. Apa yang ingin Anda kerjakan hari ini?
                </p>
                
                {/* Container Tombol: Ditambah flex-wrap agar aman di mobile */}
                <div className="flex flex-wrap gap-3">
                    <Link href="/admin/news" className="bg-white text-green-800 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-green-50 transition shadow-lg inline-flex items-center gap-2">
                        <span>✍</span> Tulis Artikel
                    </Link>
                    <Link href="/admin/mountains" className="bg-green-700 text-white border border-green-500 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-green-600 transition shadow-lg inline-flex items-center gap-2">
                        <span>🏔</span> Tambah Gunung
                    </Link>
                    
                    {/* --- TOMBOL BARU: LIHAT WEBSITE --- */}
                    <Link 
                        href="/" 
                        target="_blank" 
                        className="bg-green-900/30 text-white border border-green-400/30 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-green-900/50 transition shadow-lg inline-flex items-center gap-2"
                    >
                        <span>🌐</span> Lihat Website
                    </Link>
                </div>
            </div>
            {/* Hiasan background */}
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl"></div>
        </div>

        {/* 2. STATISTIK RINGKAS */}
        <h3 className="font-bold text-gray-800 text-lg">Statistik Platform</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card Gunung */}
            <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Database Gunung</p>
                    <h3 className="text-3xl font-bold text-gray-800">{isLoading ? "..." : stats.mountains}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-2xl">🏔</div>
            </div>

            {/* Card Artikel */}
            <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Artikel Terbit</p>
                    <h3 className="text-3xl font-bold text-gray-800">{isLoading ? "..." : stats.news}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl">📰</div>
            </div>

            {/* Card User */}
            <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Pengguna</p>
                    <h3 className="text-3xl font-bold text-gray-800">{isLoading ? "..." : stats.users}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">👥</div>
            </div>

        </div>

        {/* 3. AKSI CEPAT (SHORTCUTS) */}
        <h3 className="font-bold text-gray-800 text-lg pt-4">Aksi Cepat</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <Link href="/admin/news" className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-green-500 hover:shadow-md transition cursor-pointer flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl group-hover:scale-110 transition">
                    ✍
                </div>
                <div>
                    <h4 className="font-bold text-gray-800 group-hover:text-green-600 transition">Kelola Berita & Tips</h4>
                    <p className="text-xs text-gray-500">Tulis artikel baru atau edit berita penting.</p>
                </div>
                <div className="ml-auto text-gray-300 group-hover:text-green-600">→</div>
            </Link>

            <Link href="/admin/mountains" className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-green-500 hover:shadow-md transition cursor-pointer flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl group-hover:scale-110 transition">
                    🏔
                </div>
                <div>
                    <h4 className="font-bold text-gray-800 group-hover:text-green-600 transition">Database Gunung</h4>
                    <p className="text-xs text-gray-500">Update status jalur atau tambah gunung baru.</p>
                </div>
                <div className="ml-auto text-gray-300 group-hover:text-green-600">→</div>
            </Link>

        </div>

    </div>
  );
}