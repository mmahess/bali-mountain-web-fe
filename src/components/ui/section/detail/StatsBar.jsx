export default function StatsBar({ mountain }) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 border border-gray-100">
        <div className="text-center border-r border-gray-100 last:border-0">
            <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase mb-1 tracking-wider">Ketinggian</p>
            <p className="text-xl md:text-2xl font-bold text-gray-800">
                {mountain.elevation} <span className="text-xs text-gray-400 font-normal">mdpl</span>
            </p>
        </div>
        <div className="text-center border-r border-gray-100 last:border-0">
            <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase mb-1 tracking-wider">Elevasi Gain</p>
            <p className="text-xl md:text-2xl font-bold text-gray-800">
                {mountain.elevation_gain} <span className="text-xs text-gray-400 font-normal">m</span>
            </p>
        </div>
        <div className="text-center border-r border-gray-100 last:border-0">
            <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase mb-1 tracking-wider">Estimasi Waktu</p>
            <p className="text-xl md:text-2xl font-bold text-gray-800">
                6-8 <span className="text-xs text-gray-400 font-normal">Jam</span>
            </p>
        </div>
        <div className="text-center">
            <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase mb-1 tracking-wider">Jarak Tempuh</p>
            <p className="text-xl md:text-2xl font-bold text-gray-800">
                {mountain.distance} <span className="text-xs text-gray-400 font-normal">km</span>
            </p>
        </div>
    </div>
  );
}