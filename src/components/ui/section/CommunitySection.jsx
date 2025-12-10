export default function CommunitySection() {
  return (
    <section className="py-8 bg-bg-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Aktivitas Komunitas ⛺</h2>
            <p className="text-gray-500 text-sm mt-1">Lihat siapa yang sedang mencari tim.</p>
          </div>
          <div className="bg-white p-1 rounded-xl flex text-xs font-bold shadow-sm border border-gray-100">
            <button className="bg-primary text-white shadow-md px-4 py-2 rounded-lg">Cari Barengan</button>
            <button className="text-gray-500 px-4 py-2 hover:text-gray-700">Feed Foto</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-card hover:border-primary transition group flex flex-col md:flex-row gap-5 items-start">
              <div className="shrink-0 text-center md:w-16">
                <img src="https://i.pravatar.cc/150?img=11" className="w-12 h-12 rounded-full mx-auto mb-2 border-2 border-white shadow-md" alt="User" />
                <p className="text-[10px] font-bold text-gray-900">Raka</p>
              </div>
              <div className="grow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-bold text-gray-800 group-hover:text-primary transition">Tektok Gunung Gede via Putri</h4>
                  <span className="bg-red-50 text-red-600 text-[10px] font-bold px-3 py-1 rounded-full border border-red-100">2 Slot Tersisa</span>
                </div>
                <p className="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed">Mencari teman yang santai tapi pace stabil. Kita berangkat jumat malam dari Jakarta naik travel bareng.</p>
                <div className="flex flex-wrap gap-2 text-[10px] font-bold text-gray-600">
                  <span className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">🗓 12-13 Des</span>
                  <span className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">📍 Cibodas</span>
                  <span className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">💰 Sharecost</span>
                </div>
              </div>
              <div className="w-full md:w-auto mt-2 md:mt-0 self-center">
                <button className="w-full bg-primary text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-green-700 shadow-lg shadow-green-100">Gabung</button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl shadow-card h-full border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 text-sm">Momen Hari Ini 📸</h3>
                <span className="text-[10px] text-gray-400">12 Updated</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-200 h-24 rounded-xl w-full"></div>
                <div className="bg-gray-200 h-24 rounded-xl w-full"></div>
                <div className="bg-gray-200 h-24 rounded-xl w-full col-span-2"></div>
              </div>
              <button className="text-primary text-xs font-bold hover:underline w-full text-center mt-4">Lihat Semua Galeri →</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}