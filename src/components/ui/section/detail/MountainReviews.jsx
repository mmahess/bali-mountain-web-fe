"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function MountainReviews({ mountainId, initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews || []);
  const [isWriting, setIsWriting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) return toast.error("Silakan login untuk memberi ulasan!");
    if (rating === 0) return toast.error("Pilih rating bintang dulu!");
    if (!comment.trim()) return toast.error("Tulis komentar Anda!");

    setIsSubmitting(true);
    const toastId = toast.loading("Mengirim ulasan...");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/hiking-trails/${mountainId}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Ulasan terkirim!", { id: toastId });

      // Tambahkan review baru ke list tanpa refresh halaman
      const newReview = res.data.data;
      // Kita butuh data user sementara agar langsung tampil (karena response mungkin belum populate user full)
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      newReview.user = currentUser; 
      
      setReviews([newReview, ...reviews]);
      
      // Reset Form
      setIsWriting(false);
      setRating(0);
      setComment("");

    } catch (error) {
      console.error(error);
      if (error.response?.status === 400) {
          toast.error(error.response.data.message, { id: toastId });
      } else {
          toast.error("Gagal mengirim ulasan.", { id: toastId });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Ulasan Pendaki ({reviews.length})
        </h2>
        <button 
          onClick={() => setIsWriting(!isWriting)}
          className="text-primary font-bold text-sm hover:underline"
        >
          {isWriting ? "Batal" : "Tulis Ulasan"}
        </button>
      </div>

      {/* FORM INPUT */}
      {isWriting && (
        <form onSubmit={handleSubmitReview} className="mb-8 bg-gray-50 p-5 rounded-xl border border-gray-100 animate-in fade-in">
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className={`text-2xl transition-transform hover:scale-110 focus:outline-none ${
                    star <= (hoverRating || rating) ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500 self-center font-medium">
                {rating > 0 ? `${rating} Bintang` : "Pilih Bintang"}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Komentar</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-green-500 outline-none"
              rows="3"
              placeholder="Bagikan pengalamanmu..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white font-bold text-sm px-6 py-2.5 rounded-lg shadow-md hover:bg-green-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
          </button>
        </form>
      )}

      {/* LIST REVIEW */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review, idx) => (
            <div key={review.id || idx} className="flex gap-4 border-b border-gray-50 pb-6 last:border-0 last:pb-0">
              <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                <img 
                  src={review.user?.avatar || `https://ui-avatars.com/api/?name=${review.user?.name || 'User'}&background=random`} 
                  alt={review.user?.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">{review.user?.name || 'Pendaki'}</h4>
                <div className="text-yellow-400 text-xs mb-1">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  "{review.comment}"
                </p>
                <p className="text-[10px] text-gray-400 mt-2">
                    {review.created_at ? new Date(review.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Baru saja'}
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
  );
}