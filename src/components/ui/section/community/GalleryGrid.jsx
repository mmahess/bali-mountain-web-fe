"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
// Import icon X untuk tombol close (bisa pakai library icon lain)
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-x"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function GalleryGrid({ gallery, refreshData }) {
  // --- 1. STATE MANAGEMENT ---
  const [localGallery, setLocalGallery] = useState(gallery || []);
  const [selectedImage, setSelectedImage] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Token & User
  const [token, setToken] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const BACKEND_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

  // --- 2. EFFECT HOOKS ---
  useEffect(() => {
    if (gallery) setLocalGallery(gallery);
  }, [gallery]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken) setToken(storedToken);
      if (storedUser) setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Kunci scroll body saat modal terbuka agar yang ke-scroll cuma modalnya
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedImage]);

  // --- 3. HELPER FUNCTIONS ---
  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const getImageUrl = (filename) =>
    filename ? `${BACKEND_URL}/storage/images/${filename}` : "";

  // Helper format waktu dinamis
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "Baru saja";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} menit yang lalu`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam yang lalu`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} hari yang lalu`;

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const updateLocalState = (updatedItem) => {
    setLocalGallery((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setSelectedImage(updatedItem);
  };

  // --- 4. ACTION HANDLERS ---
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus postingan ini?")) return;
    const loadingToast = toast.loading("Menghapus...");

    try {
      await axios.delete(
        `${BACKEND_URL}/api/galleries/${id}`,
        getAuthHeaders()
      );

      toast.dismiss(loadingToast);
      toast.success("Postingan berhasil dihapus");

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
    if (!commentInput.trim()) return;
    if (!token) return toast.error("Anda harus login untuk berkomentar!");

    setIsSubmitting(true);

    // Auto scroll ke bawah setelah komen (opsional, agar komen baru terlihat)
    const commentList = document.getElementById("comment-list");
    if (commentList)
      setTimeout(() => {
        commentList.scrollTop = commentList.scrollHeight;
      }, 100);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/galleries/${selectedImage.id}/comments`,
        { body: commentInput },
        getAuthHeaders()
      );

      const newComment = {
        ...res.data.data,
        user: currentUser || { name: "Saya" },
      };

      const updatedItem = {
        ...selectedImage,
        comments: [...(selectedImage.comments || []), newComment],
      };

      updateLocalState(updatedItem);
      setCommentInput("");
      toast.success("Komentar terkirim!", { position: "bottom-center" });
    } catch (err) {
      toast.error("Gagal kirim komentar");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async () => {
    if (!token)
      return toast.error("Login dulu untuk like!", {
        position: "bottom-center",
      });

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/galleries/${selectedImage.id}/like`,
        {},
        getAuthHeaders()
      );

      const isLikedNow = res.data.status === "liked";

      const updatedItem = {
        ...selectedImage,
        likes_count: res.data.total_likes,
        is_liked: isLikedNow,
      };

      updateLocalState(updatedItem);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memproses like");
    }
  };

  if (!localGallery || localGallery.length === 0)
    return (
      <div className="text-center py-10 text-gray-400">Belum ada foto.</div>
    );

  return (
    <>
      {/* GRID VIEW */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {localGallery.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage(item)}
            className="group relative rounded-xl overflow-hidden aspect-square bg-gray-100 cursor-pointer shadow-sm hover:shadow-md transition"
          >
            <img
              src={getImageUrl(item.image)}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-end p-2 md:p-3 bg-linear-to-t from-black/60 via-transparent">
              <div className="text-white text-[10px] md:text-xs flex gap-3 font-medium">
                <span className="flex items-center gap-1">
                  ❤️ {item.likes_count || 0}
                </span>
                <span className="flex items-center gap-1">
                  💬 {item.comments?.length || 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL VIEW OPTIMIZED FOR MOBILE */}
      {selectedImage && (
        // Container luar: Fullscreen di mobile (z-50), ada backdrop
        <div className="fixed inset-0 z-50 flex md:items-center md:justify-center bg-black/95 md:bg-black/90 md:backdrop-blur-sm md:p-4 animate-in fade-in duration-200">
          {/* Tombol Close (X) di Mobile - Pojok Kanan Atas */}
          <button
            onClick={() => setSelectedImage(null)}
            className="md:hidden absolute top-4 right-4 z-60 text-white bg-black/50 p-2 rounded-full backdrop-blur-md"
          >
            <CloseIcon />
          </button>

          {/* Container dalam: Layout Flex Col di Mobile, Row di Desktop */}
          <div
            className="bg-white w-full h-full md:h-[85vh] md:max-w-5xl md:rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* --- BAGIAN ATAS: FOTO (Mobile: Tinggi menyesuaikan, Desktop: Lebar 3/5) --- */}
            <div className="relative w-full md:w-3/5 bg-black flex items-center justify-center shrink-0 md:h-full max-h-[50vh] md:max-h-full bg-pattern">
              <img
                src={getImageUrl(selectedImage.image)}
                className="w-full h-full object-contain"
                alt="Detail Post"
              />
            </div>

            {/* --- BAGIAN BAWAH/KANAN: DETAIL (Mobile: Sisa tinggi, Desktop: Lebar 2/5) --- */}
            <div className="flex-1 flex flex-col bg-white min-h-0 relative md:static">
              {/* 1. HEADER USER (Sticky di top section ini) */}
              <div className="p-3 md:p-4 border-b flex items-center justify-between gap-3 bg-white shrink-0 sticky top-0 z-10">
                {/* BAGIAN KIRI: Info User */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 overflow-hidden border border-gray-200 shrink-0">
                    {selectedImage.user?.avatar ? (
                      <img
                        src={selectedImage.user.avatar}
                        className="w-full h-full object-cover"
                      />
                    ) : selectedImage.user?.name ? (
                      selectedImage.user.name[0]
                    ) : (
                      "U"
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 leading-tight">
                      {selectedImage.user?.name || "User"}
                    </h4>
                    <p className="text-[10px] md:text-xs text-gray-500">
                      {formatTimeAgo(selectedImage.created_at)}
                    </p>
                  </div>
                </div>

                {/* BAGIAN KANAN: Tombol Hapus & Close Desktop */}
                <div className="flex items-center gap-2">
                  {/* Tombol Hapus (Hanya muncul jika user pemilik/admin) */}
                  {currentUser &&
                    (selectedImage.user_id === currentUser.id ||
                      currentUser.role === "admin") && (
                      <button
                        onClick={() => handleDelete(selectedImage.id)}
                        className="text-red-500 text-xs font-medium hover:bg-red-50 px-3 py-1.5 rounded-full transition border border-red-100"
                      >
                        Hapus
                      </button>
                    )}

                  {/* --- INI YANG BARU: Tombol Close Khusus Desktop --- */}
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="hidden md:flex text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition"
                    title="Tutup Modal"
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>

              {/* 2. LIST KOMENTAR (Area Scrollable) */}
              {/* Gunakan id="comment-list" untuk referensi auto-scroll */}
              <div
                id="comment-list"
                className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 bg-gray-50/30 overscroll-contain"
              >
                {/* Caption Pengguna */}
                {selectedImage.caption && (
                  <div className="pb-3 mb-2 border-b border-dashed">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      <span className="font-bold mr-2">
                        {selectedImage.user?.name}:
                      </span>
                      {selectedImage.caption}
                    </p>
                  </div>
                )}

                {selectedImage.comments && selectedImage.comments.length > 0 ? (
                  selectedImage.comments.map((comment, idx) => (
                    <div
                      key={idx}
                      className="flex gap-2 text-sm items-start animate-in slide-in-from-bottom-2"
                    >
                      {/* Avatar kecil komentator */}
                      <div className="w-6 h-6 mt-0.5 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                        <img
                          src={`https://ui-avatars.com/api/?name=${comment.user?.name}&size=24`}
                          className="w-full h-full"
                        />
                      </div>
                      <div className="bg-white p-2.5 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-[85%]">
                        <span className="font-bold text-gray-900 text-xs block mb-0.5">
                          {comment.user?.name || "Anon"}
                        </span>
                        <span className="text-gray-700 leading-snug">
                          {comment.body}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-32 flex flex-col items-center justify-center text-gray-300 gap-2 my-auto">
                    <p className="text-sm font-medium">Belum ada komentar.</p>
                    <p className="text-xs">Jadilah yang pertama berkomentar!</p>
                  </div>
                )}
              </div>

              {/* 3. FOOTER: ACTIONS & INPUT (Sticky di Bottom) */}
              <div className="bg-white border-t shrink-0 pb-safe-area md:pb-0 sticky bottom-0 z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                {/* Tombol Like */}
                <div className="px-4 py-2 flex items-center">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 font-bold text-sm transition group ${
                      selectedImage.is_liked
                        ? "text-red-600"
                        : "text-gray-700 hover:text-red-600"
                    }`}
                  >
                    <span
                      className={`text-xl transition-transform ${
                        selectedImage.is_liked
                          ? "scale-110"
                          : "group-hover:scale-110"
                      }`}
                    >
                      {selectedImage.is_liked ? "❤️" : "🤍"}
                    </span>
                    <span>
                      {selectedImage.likes_count > 0
                        ? `${selectedImage.likes_count} suka`
                        : "Suka"}
                    </span>
                  </button>
                </div>

                {/* Input Komentar */}
                <form
                  onSubmit={handleComment}
                  className="flex items-center gap-2 px-3 pb-3 pt-1"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 overflow-hidden hidden md:block border border-gray-100">
                    <img
                      src={
                        currentUser?.avatar ||
                        `https://ui-avatars.com/api/?name=${
                          currentUser?.name || "G"
                        }`
                      }
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      className="w-full border border-gray-200 bg-gray-100 rounded-full pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition placeholder:text-gray-400"
                      placeholder={
                        currentUser
                          ? `Komentar sebagai ${
                              currentUser.name.split(" ")[0]
                            }...`
                          : "Login untuk komentar..."
                      }
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      disabled={isSubmitting || !currentUser}
                    />
                    <button
                      type="submit"
                      disabled={
                        isSubmitting || !commentInput.trim() || !currentUser
                      }
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 text-indigo-600 font-bold text-sm disabled:opacity-30 px-3 py-1.5 hover:bg-indigo-50 rounded-full transition"
                    >
                      Kirim
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
