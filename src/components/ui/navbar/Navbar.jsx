import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-lg shadow-green-100">
            MG
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">MuncakGunung</span>
        </Link>

        <div className="hidden md:flex gap-8 font-medium text-sm text-gray-500">
          <Link href="/" className="text-primary font-bold">Beranda</Link>
          <Link href="/gunung" className="hover:text-primary transition">Katalog Gunung</Link>
          <Link href="/komunitas" className="hover:text-primary transition">Komunitas</Link>
          <Link href="/berita" className="hover:text-primary transition">Berita</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-primary px-4 py-2">
            Masuk
          </Link>
          <Link href="/register" className="bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-green-700 transition shadow-xl shadow-green-200">
            Daftar Akun
          </Link>
        </div>
      </div>
    </nav>
  );
}