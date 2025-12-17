export default function GalleryGrid({ gallery }) {
  if (!gallery || gallery.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
        <p className="text-gray-400 text-sm">Belum ada foto momen yang dibagikan.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {gallery.map((post) => (
        <div key={post.id} className="relative group rounded-xl overflow-hidden aspect-square bg-gray-100">
          <img 
            src={post.image_path} 
            alt="Momen Pendaki" 
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-end p-4">
             <div className="text-white">
                <p className="text-xs font-bold">{post.user?.name}</p>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
}