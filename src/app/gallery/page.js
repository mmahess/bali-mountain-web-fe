"use client";

import React, { useEffect, useState } from "react";
// Pastikan path import ini sesuai dengan lokasi file GalleryGrid Anda
import GalleryGrid from "@/components/ui/section/community/GalleryGrid"; 

export const dynamic = 'force-dynamic';

export default function GalleryPage() {
  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- KONFIGURASI URL ---
  // Gunakan ${process.env.NEXT_PUBLIC_API_URL}:8000 jika localhost bermasalah (failed to fetch)
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/galleries`;

  // --- FUNGSI FETCH DATA ---
  // Kita buat function ini di luar useEffect agar bisa dikirim ke anak (GalleryGrid)
  const fetchGalleries = async () => {
    try {
      // Set loading kecil (opsional, biar user tau sedang refresh)
      // setLoading(true); 
      
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      
      // Ambil data dari response.data (sesuai format JSON Laravel controller kita)
      setGalleryData(result.data || []);
      
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- EFFEK PERTAMA KALI LOAD ---
  useEffect(() => {
    fetchGalleries();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Halaman */}
      <div className="bg-gray-50 border-b py-10 mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Galeri Momen</h1>
          <p className="text-gray-500">Kumpulan kenangan terbaik dari komunitas kita.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        {/* State: Error */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-center border border-red-200">
            Gagal memuat galeri: {error}. Pastikan server Laravel menyala.
          </div>
        )}

        {/* State: Loading */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 aspect-square rounded-xl"></div>
            ))}
          </div>
        ) : (
          /* State: Sukses - Tampilkan Grid */
          /* PENTING: Kita kirim props 'refreshData' di sini */
          <GalleryGrid 
            gallery={galleryData} 
            refreshData={fetchGalleries}
            token={token} 
            currentUser={user}
          />
        )}
      </div>
    </div>
  );
}