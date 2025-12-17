"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  
  // State untuk form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // State untuk status loading & error
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fungsi Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login gagal");
      }

      // --- LOGIN SUKSES ---
      
      // 1. Simpan Token & User Data di LocalStorage
      // (Di project nyata, disarankan pakai Cookies/NextAuth untuk keamanan lebih tinggi)
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.data));
      localStorage.setItem("role", data.role);

      // 2. Cek Role & Redirect
      if (data.role === "admin") {
        alert("Selamat datang, Admin! 👮‍♂️");
        router.push("/admin/dashboard"); // Nanti kita buat halaman ini
      } else {
        alert(`Halo, ${data.data.name}! 👋`);
        router.push("/"); // Kembali ke Beranda
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-soft p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-lg shadow-green-100 mx-auto">
              MG
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Selamat Datang Kembali!</h1>
          <p className="text-gray-500 text-sm mt-2">Masuk untuk mulai petualanganmu.</p>
        </div>

        {/* Alert Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-6 text-center border border-red-100 font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white transition"
            />
            <div className="text-right mt-2">
              <a href="#" className="text-xs text-primary font-bold hover:underline">Lupa password?</a>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-100 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              "Masuk Sekarang"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Belum punya akun? <Link href="/register" className="text-primary font-bold hover:underline">Daftar di sini</Link>
        </div>

      </div>
    </div>
  );
}