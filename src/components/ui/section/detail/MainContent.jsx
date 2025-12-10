export default function MainContent({ mountain }) {
  return (
    <div className="lg:col-span-2 space-y-8">
        
        {/* Deskripsi */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tentang {mountain.name}</h2>
            <div className="prose prose-green max-w-none text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
                {mountain.description}
            </div>
        </section>

        {/* Galeri Foto (DINAMIS) */}
        <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Galeri Foto</h2>
            {mountain.images && mountain.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {mountain.images.map((img, index) => (
                        <div key={index} className="h-32 w-full rounded-xl overflow-hidden relative group">
                            <img 
                                src={img.image_url} 
                                alt={`Galeri ${index + 1}`} 
                                className="w-full h-full object-cover hover:scale-110 transition duration-500 cursor-pointer"
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-300 text-center">
                    <p className="text-gray-500 text-sm">Belum ada foto galeri.</p>
                </div>
            )}
        </section>

        {/* Ulasan (DINAMIS) */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                    Ulasan Pendaki ({mountain.reviews ? mountain.reviews.length : 0})
                </h2>
                <button className="text-primary font-bold text-sm hover:underline">Tulis Ulasan</button>
            </div>

            {mountain.reviews && mountain.reviews.length > 0 ? (
                <div className="space-y-6">
                    {mountain.reviews.map((review) => (
                        <div key={review.id} className="flex gap-4 border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                            <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                                <img 
                                    src={review.user?.avatar || `https://ui-avatars.com/api/?name=${review.user?.name || 'User'}`} 
                                    alt={review.user?.name} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-900">{review.user?.name || 'Pendaki'}</h4>
                                <div className="text-yellow-400 text-xs mb-1">
                                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    "{review.comment}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <div className="text-4xl mb-2">💬</div>
                    <p className="text-gray-500 text-sm font-medium">Belum ada ulasan. Jadilah yang pertama!</p>
                </div>
            )}
        </section>
    </div>
  );
}