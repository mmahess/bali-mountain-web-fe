import MapViewer from "../MapViewer"; // Pastikan path import ini sesuai

export default function SidebarDetail({ mountain }) {
  return (
    <aside className="space-y-6 sticky top-24 h-fit">
        {/* INFO PENTING */}
        <div className={`bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-l-4 ${mountain.is_guide_required ? 'border-red-500' : 'border-green-500'}`}>
            <h3 className="font-bold text-gray-900 mb-4 text-sm flex items-center gap-2 uppercase tracking-wide">
                <span>ℹ️</span> Informasi Penting
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-3 items-start">
                    <span className={`${mountain.is_guide_required ? 'text-red-500' : 'text-green-500'} font-bold`}>•</span>
                    <span className="font-medium">
                        {mountain.is_guide_required ? 'Wajib Menggunakan Guide' : 'Guide Opsional (Tidak Wajib)'}
                    </span>
                </li>
                <li className="flex gap-3 items-start">
                    <span className="text-green-500 font-bold">•</span>
                    <span>Tiket: Rp {parseInt(mountain.ticket_price).toLocaleString('id-ID')}</span>
                </li>
                <li className="flex gap-3 items-start">
                    <span className="text-green-500 font-bold">•</span>
                    <span>Registrasi di {mountain.starting_point}</span>
                </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-gray-100">
                 <button className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-100 text-sm">
                    Buat Open Trip Disini
                </button>
            </div>
        </div>

        {/* MAP VIEWER */}
        <MapViewer mapUrl={mountain.map_iframe_url} />
    </aside>
  );
}