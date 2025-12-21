import { useState, useEffect } from "react";
import axios from "axios";
import toast from 'react-hot-toast'; 

// HAPUS props 'token' dan 'currentUser' dari sini
export default function GalleryGrid({ gallery, refreshData }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // STATE BARU: Untuk menyimpan Token & User Internal
  const [token, setToken] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const BACKEND_URL = "http://localhost:8000"; 

  // --- AMBIL TOKEN OTOMATIS SAAT COMPONENT DIBUKA ---
  useEffect(() => {
    // Cek apakah kode jalan di browser
    if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("token"); // Pastikan nama key sesuai waktu login
        const storedUser = localStorage.getItem("user");

        if (storedToken) setToken(storedToken);
        if (storedUser) setCurrentUser(JSON.parse(storedUser));
    }
  }, []);
  // ---------------------------------------------------

  // Helper Header (Sama seperti sebelumnya)
  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${token}`, 
      'Content-Type': 'application/json',
    }
  });

  // --- HANDLER: DELETE ---
  const handleDelete = async (id) => {
    if(!confirm("Hapus postingan ini?")) return;
    const loadingToast = toast.loading('Menghapus...');
    
    try {
      await axios.delete(`${BACKEND_URL}/api/galleries/${id}`, getAuthHeaders());
      toast.dismiss(loadingToast);
      toast.success('Postingan berhasil dihapus');
      setSelectedImage(null);
      refreshData();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error(err);
      toast.error(err.response?.data?.message || "Gagal menghapus");
    }
  };

  // --- HANDLER: COMMENT ---
  const handleComment = async (e) => {
    e.preventDefault();
    if(!commentInput.trim()) return;
    if (!token) return toast.error("Anda harus login untuk berkomentar!");

    setIsSubmitting(true);
    const loadingToast = toast.loading('Mengirim komentar...');

    try {
      // POST ke Backend
      const res = await axios.post(
        `${BACKEND_URL}/api/galleries/${selectedImage.id}/comments`, 
        { body: commentInput }, 
        getAuthHeaders()
      );

      toast.dismiss(loadingToast);
      toast.success('Komentar terkirim!');

      // Update UI dengan komentar baru (pastikan user object ada)
      // Kita inject user lokal sementara biar kelihatan langsung
      const newComment = {
          ...res.data.data,
          user: currentUser || { name: "Saya" } 
      };

      setSelectedImage(prev => ({
        ...prev,
        comments: [newComment, ...(prev.comments || [])]
      }));
      setCommentInput(""); 

    } catch (err) {
      toast.dismiss(loadingToast);
      console.error(err);
      toast.error("Gagal kirim komentar");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- HANDLER: LIKE ---
  const handleLike = async () => {
    if (!token) return toast.error("Login dulu untuk like!");

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/galleries/${selectedImage.id}/like`, 
        {}, 
        getAuthHeaders()
      );
      
      const isLikedNow = res.data.status === 'liked';
      if (isLikedNow) toast.success("Liked! ❤️");
      else toast("Unliked", { icon: "💔" });

      setSelectedImage(prev => ({
        ...prev,
        likes_count: res.data.total_likes,
        is_liked: isLikedNow
      }));
      
      refreshData(); 
    } catch (err) {
      console.error(err);
      toast.error("Gagal memproses like");
    }
  };

  const getImageUrl = (filename) => filename ? `${BACKEND_URL}/storage/images/${filename}` : "";

  if (!gallery || gallery.length === 0) return <div className="text-center py-10 text-gray-400">Belum ada foto.</div>;

  // --- RENDER UI (Tidak berubah banyak) ---
  return (
    <>
      {/* GRID VIEW */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((item) => (
          <div key={item.id} onClick={() => setSelectedImage(item)} className="group relative rounded-xl overflow-hidden aspect-square bg-gray-100 cursor-pointer shadow hover:shadow-lg transition">
            <img src={getImageUrl(item.image)} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-end p-3">
               <div className="text-white text-xs flex gap-3">
                 <span className="flex items-center gap-1">
                    {item.is_liked ? '❤️' : '🤍'} {item.likes_count || 0}
                 </span>
                 <span className="flex items-center gap-1">💬 {item.comments?.length || 0}</span>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL VIEW */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
          <div className="bg-white rounded-xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row h-[80vh]" onClick={(e) => e.stopPropagation()}>
            
            {/* KIRI: FOTO */}
            <div className="md:w-3/5 bg-black flex items-center justify-center relative">
               <img src={getImageUrl(selectedImage.image)} className="max-h-full max-w-full object-contain" />
            </div>

            {/* KANAN: INTERAKSI */}
            <div className="md:w-2/5 flex flex-col bg-white">
              <div className="p-4 border-b flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                  {selectedImage.user?.name ? selectedImage.user.name[0] : "U"}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{selectedImage.user?.name || "User"}</h4>
                  <p className="text-xs text-gray-500">{selectedImage.caption}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedImage.comments && selectedImage.comments.length > 0 ? (
                    selectedImage.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 text-sm">
                            <span className="font-bold text-gray-800 shrink-0">{comment.user?.name || "Anon"}:</span>
                            <span className="text-gray-600">{comment.body}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-400 text-sm mt-10">Belum ada komentar.</p>
                )}
              </div>

              <div className="p-4 border-t bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                   <button onClick={handleLike} className={`flex items-center gap-2 font-medium px-3 py-1 rounded-full transition ${selectedImage.is_liked ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:bg-gray-100'}`}>
                      <svg className="w-6 h-6" fill={selectedImage.is_liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                      {selectedImage.likes_count || 0} Likes
                   </button>

                   {/* LOGIK HAPUS: Cek apakah ID user sama dengan ID pemilik foto */}
                   {currentUser && selectedImage.user_id === currentUser.id && (
                       <button onClick={() => handleDelete(selectedImage.id)} className="text-red-500 text-xs hover:underline">Hapus Post</button>
                   )}
                </div>

                <form onSubmit={handleComment} className="flex gap-2">
                   <input 
                      type="text" 
                      className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Tulis komentar..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      disabled={isSubmitting}
                   />
                   <button type="submit" disabled={isSubmitting || !commentInput} className="text-indigo-600 font-bold text-sm disabled:opacity-50">
                      Kirim
                   </button>
                </form>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}