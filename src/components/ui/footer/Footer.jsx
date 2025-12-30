import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">
                <img 
                  src="/logo.png" 
                  alt="Logo Pendakian Bali" 
                  className="w-full h-full object-contain p-1" 
                />
              </div>
              <span className="text-xl font-bold text-gray-800">SobatMuncak</span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
              Platform nomor satu untuk mencari teman pendakian dan informasi gunung di Bali. Jelajahi alam dengan aman dan seru.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-sm">Navigasi</h4>
            <ul className="space-y-3 text-xs text-gray-500 font-medium">
              <li><Link href="/" className="hover:text-primary transition">Beranda</Link></li>
              <li><Link href="/gunung" className="hover:text-primary transition">Katalog Gunung</Link></li>
              <li><Link href="/komunitas" className="hover:text-primary transition">Komunitas</Link></li>
              <li><Link href="/berita" className="hover:text-primary transition">Berita & Tips</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-sm">Ikuti Kami</h4>
            <ul className="space-y-3 text-xs text-gray-500 font-medium">
              <li><a href="#" className="hover:text-primary transition flex items-center gap-2">📷 Instagram</a></li>
              <li><a href="#" className="hover:text-primary transition flex items-center gap-2">🎥 TikTok</a></li>
              <li><a href="#" className="hover:text-primary transition flex items-center gap-2">📘 Facebook</a></li>
              <li><a href="#" className="hover:text-primary transition flex items-center gap-2">🐦 Twitter / X</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-sm">Hubungi Kami</h4>
            <ul className="space-y-3 text-xs text-gray-500 font-medium">
              <li>📧 support@sobatmuncak.com</li>
              <li>📞 +62 877 3033 9622</li>
              <li>📍 Singaraja, Bali, Indonesia</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 text-center">
          <p className="text-gray-400 text-[10px]">
            &copy; {new Date().getFullYear()} SobatMuncak Project. Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}