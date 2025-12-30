"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; // <--- Import Toast

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Loading Toast dimulai
    const toastId = toast.loading("Sedang memproses...");

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
        throw new Error(data.message || "Login gagal.");
      }

      // --- SUKSES ---
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.data));
      localStorage.setItem("role", data.role);

      // Ganti loading jadi sukses
      toast.success(`Selamat datang, ${data.data.name}!`, { id: toastId });

      if (data.role === "admin") {
        router.push("/admin/dashboard"); 
      } else {
        router.push("/");
      }

    } catch (err) {
      // Ganti loading jadi error
      toast.error(err.message || "Terjadi kesalahan", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-soft p-4 font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        
        <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <div className="w-25 h-25 rounded-xl flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">
                <img 
                  src="/logo.png" 
                  alt="Logo Pendakian Bali" 
                  className="w-full h-full object-contain p-1" 
                />
              </div>
            </Link>
          <h1 className="text-2xl font-bold text-gray-900">Selamat Datang Kembali!</h1>
          <p className="text-gray-500 text-sm mt-2">Masuk untuk mulai petualanganmu.</p>
        </div>

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
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-100 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? "Memproses..." : "Masuk Sekarang"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Belum punya akun? <Link href="/register" className="text-primary font-bold hover:underline">Daftar di sini</Link>
        </div>

      </div>
    </div>
  );
}