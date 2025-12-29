import { useState, useEffect } from "react";
import axios from "axios";
import toast from 'react-hot-toast'; 

export default function GalleryGrid({ gallery, refreshData }) {
  // --- 1. STATE MANAGEMENT ---
  const [localGallery, setLocalGallery] = useState(gallery || []);
  const [selectedImage, setSelectedImage] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State Token & User
  const [token, setToken] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const BACKEND_URL = "http://localhost:8000"; 

  // --- 2. EFFECT HOOKS ---
  useEffect(() => {
    if (gallery) setLocalGallery(gallery);
  }, [gallery]);

  useEffect(() => {
    if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("token"); 
        const storedUser = localStorage.getItem("user");

        if (storedToken) setToken(storedToken);
        // Pastikan JSON.parse berhasil mengambil object user lengkap (termasuk role)
        if (storedUser) setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // --- 3. HELPER FUNCTIONS ---
  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${token}`, 
      'Content-Type': 'application/json',
    }
  });

  const getImageUrl = (filename) => filename ? `${BACKEND_URL}/storage/images/${filename}` : "";

  const updateLocalState = (updatedItem) => {
    setLocalGallery(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    setSelectedImage(updatedItem);
  };

  // --- 4. ACTION HANDLERS ---
  const handleDelete = async (id) => {
    if(!confirm("Yakin ingin menghapus postingan ini?")) return;
    const loadingToast = toast.loading('Menghapus...');
    
    try {
      await axios.delete(`${BACKEND_URL}/api/galleries/${id}`, getAuthHeaders());
      
      toast.dismiss(loadingToast);
      toast.success('Postingan berhasil dihapus');
      
      setSelectedImage(null); // Tutup modal
      refreshData(); // Refresh data utama
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error(err);
      toast.error(err.response?.data?.message || "Gagal menghapus");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if(!commentInput.trim()) return;
    if (!token) return toast.error("Anda harus login untuk berkomentar!");

    setIsSubmitting(true);
    const loadingToast = toast.loading('Mengirim komentar...');

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/galleries/${selectedImage.id}/comments`, 
        { body: commentInput }, 
        getAuthHeaders()
      );

      toast.dismiss(loadingToast);
      toast.success('Komentar terkirim!');

      const newComment = {
          ...res.data.data,
          user: currentUser || { name: "Saya" } 
      };

      const updatedItem = {
          ...selectedImage,
          comments: [...(selectedImage.comments || []), newComment] 
      };

      updateLocalState(updatedItem);
      setCommentInput(""); 

    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Gagal kirim komentar");
    } finally {
      setIsSubmitting(false);
    }
  };

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

      const updatedItem = {
        ...selectedImage,
        likes_count: res.data.total_likes,
        is_liked: isLikedNow
      };

      updateLocalState(updatedItem);
      
    } catch (err) {
      console.error(err);
      toast.error("Gagal memproses like");
    }
  };

  if (!localGallery || localGallery.length === 0) return <div className="text-center py-10 text-gray-400">Belum ada foto.</div>;

  return (
    <>
      {/* GRID VIEW */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {localGallery.map((item) => (
          <div key={item.id} onClick={() => setSelectedImage(item)} className="group relative rounded-xl overflow-hidden aspect-square bg-gray-100 cursor-pointer shadow hover:shadow-lg transition">
            <img 
                src={getImageUrl(item.image)} 
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-end p-3">
               <div className="text-white text-xs flex gap-3 backdrop-blur-sm bg-black/20 p-2 rounded">
                 <span>{item.is_liked ? '❤️' : '🤍'} {item.likes_count || 0}</span>
                 <span>💬 {item.comments?.length || 0}</span>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL VIEW */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
          <div className="bg-white rounded-xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row h-[80vh]" onClick={(e) => e.stopPropagation()}>
            
            {/* FOTO FULL */}
            <div className="md:w-3/5 bg-black flex items-center justify-center relative">
               <img src={getImageUrl(selectedImage.image)} className="max-h-full max-w-full object-contain" />
            </div>

            {/* INTERAKSI */}
            <div className="md:w-2/5 flex flex-col bg-white">
              <div className="p-4 border-b flex items-center gap-3 shadow-sm z-10">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 overflow-hidden border border-gray-200">
                  {selectedImage.user?.avatar ? (
                      <img src={selectedImage.user.avatar} className="w-full h-full object-cover" />
                  ) : (
                      selectedImage.user?.name ? selectedImage.user.name[0] : "U"
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{selectedImage.user?.name || "User"}</h4>
                  <p className="text-xs text-gray-500 line-clamp-1">{selectedImage.caption}</p>
                </div>
              </div>

              {/* LIST KOMENTAR */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300">
                {selectedImage.comments && selectedImage.comments.length > 0 ? (
                    selectedImage.comments.map((comment, idx) => (
                        <div key={idx} className="flex gap-3 text-sm group">
                            <span className="font-bold text-gray-800 shrink-0 text-xs mt-1">{comment.user?.name || "Anon"}:</span>
                            <span className="text-gray-600 bg-gray-50 p-2 rounded-r-lg rounded-bl-lg w-full">{comment.body}</span>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                        <span className="text-3xl">💬</span>
                        <p className="text-sm">Belum ada komentar.</p>
                    </div>
                )}
              </div>

              {/* FOOTER ACTION */}
              <div className="p-4 border-t bg-white z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-3">
                   <button onClick={handleLike} className={`flex items-center gap-2 font-bold text-xs px-3 py-1.5 rounded-full transition ${selectedImage.is_liked ? 'text-red-600 bg-red-50' : 'text-gray-500 bg-gray-100 hover:bg-gray-200'}`}>
                      {selectedImage.is_liked ? '❤️' : '🤍'} {selectedImage.likes_count || 0}
                   </button>

                   {/* --- PERBAIKAN LOGIKA HAPUS DI SINI --- */}
                   {/* Muncul jika: User Login DAN (User Pemilik OR User Admin) */}
                   {currentUser && (selectedImage.user_id === currentUser.id || currentUser.role === 'admin') && (
                       <button 
                           onClick={() => handleDelete(selectedImage.id)} 
                           className="text-red-500 text-xs font-bold hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                       >
                           {/* Ubah teks biar Admin sadar dia sedang menghapus punya orang */}
                           {selectedImage.user_id === currentUser.id ? "Hapus" : "Hapus"}
                       </button>
                   )}
                   {/* -------------------------------------- */}
                </div>

                <form onSubmit={handleComment} className="flex gap-2">
                   <input 
                      type="text" 
                      className="flex-1 border border-gray-300 bg-gray-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                      placeholder="Tambahkan komentar..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      disabled={isSubmitting}
                   />
                   <button type="submit" disabled={isSubmitting || !commentInput} className="text-indigo-600 font-bold text-sm disabled:opacity-50 px-2">
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