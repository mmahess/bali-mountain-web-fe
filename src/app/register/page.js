"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; // <--- Import Toast

export default function RegisterPage() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Mendaftarkan akun...");

    if (password !== passwordConfirmation) {
      toast.error("Konfirmasi password tidak cocok!", { id: toastId });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ 
            name, 
            email, 
            password, 
            password_confirmation: passwordConfirmation 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
            const firstError = Object.values(data.errors)[0][0]; 
            throw new Error(firstError);
        }
        throw new Error(data.message || "Registrasi gagal.");
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.data));
      localStorage.setItem("role", "user");

      toast.success("Pendaftaran Berhasil!", { id: toastId });
      router.push("/");

    } catch (err) {
      toast.error(err.message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-soft p-4 font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        
        <div className="text-center mb-6">
          <Link href="/" className="inline-block mb-4">
            <div className="w-25 h-25 rounded-xl flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">
              <img 
                src="/logo.png" 
                alt="Logo Pendakian Bali" 
                className="w-full h-full object-contain p-1" 
              />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Gabung Komunitas</h1>
          <p className="text-gray-500 text-sm mt-2">Buat akun baru dan mulai petualanganmu.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Nama Lengkap</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Budi Santoso" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white transition" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white transition" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 8 karakter" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white transition" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Konfirmasi Password</label>
            <input type="password" required value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} placeholder="Ulangi password..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white transition" />
          </div>

          <div className="pt-2">
            <button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-100 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center">
                {isLoading ? "Mendaftarkan..." : "Buat Akun Baru"}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Sudah punya akun? <Link href="/login" className="text-primary font-bold hover:underline">Masuk di sini</Link>
        </div>

      </div>
    </div>
  );
}