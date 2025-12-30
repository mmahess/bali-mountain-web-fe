"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Tambahkan prop 'tripToEdit'
export default function CreateTripModal({ isOpen, onClose, onSuccess, tripToEdit }) {
  const [mountains, setMountains] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "", hiking_trail_id: "", meeting_point: "", 
    trip_date: "", max_participants: "", group_chat_link: "", description: ""
  });

  // Load Mountains
  useEffect(() => {
    if (isOpen && mountains.length === 0) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mountains`)
        .then((res) => res.json())
        .then((json) => setMountains(json.data || []));
    }
  }, [isOpen]);

  // Load Data Trip jika Edit Mode
  useEffect(() => {
    if (tripToEdit && isOpen) {
        setFormData({
            title: tripToEdit.title,
            hiking_trail_id: tripToEdit.hiking_trail_id,
            meeting_point: tripToEdit.meeting_point,
            trip_date: tripToEdit.trip_date, // Pastikan format YYYY-MM-DD
            max_participants: tripToEdit.max_participants,
            group_chat_link: tripToEdit.group_chat_link,
            description: tripToEdit.description
        });
    } else if (!tripToEdit && isOpen) {
        // Reset jika mode tambah baru
        setFormData({
            title: "", hiking_trail_id: "", meeting_point: "", 
            trip_date: "", max_participants: "", group_chat_link: "", description: ""
        });
    }
  }, [tripToEdit, isOpen]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading(tripToEdit ? "Menyimpan perubahan..." : "Menerbitkan ajakan...");

    try {
      const token = localStorage.getItem("token");
      
      // Tentukan URL & Method (POST vs PUT)
      const url = tripToEdit 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/open-trips/${tripToEdit.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/open-trips`;
      
      const method = tripToEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan");

      toast.success(tripToEdit ? "Ajakan diperbarui!" : "Ajakan terbit!", { id: toastId });
      onSuccess(); 
      onClose();

    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-99 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="text-lg font-bold text-gray-900">
               {tripToEdit ? "✏️ Edit Ajakan Trip" : "⛺ Buat Ajakan Pendakian"}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-red-500 font-bold text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar bg-white">
            <form id="tripForm" onSubmit={handleSubmit} className="space-y-4">
                {/* Form Inputs (Sama seperti sebelumnya) */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Judul Trip</label>
                    <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tujuan Gunung</label>
                        <select name="hiking_trail_id" required value={formData.hiking_trail_id} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none bg-white">
                            <option value="">Pilih Gunung...</option>
                            {mountains.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Meeting Point</label>
                        <input type="text" name="meeting_point" required value={formData.meeting_point} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tanggal Mulai</label>
                        <input type="date" name="trip_date" required value={formData.trip_date} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slot Peserta</label>
                        <input type="number" name="max_participants" required min="1" value={formData.max_participants} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Link Grup Chat</label>
                    <input type="url" name="group_chat_link" required value={formData.group_chat_link} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Detail Rencana</label>
                    <textarea name="description" required rows="3" value={formData.description} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none"></textarea>
                </div>
            </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-5 py-2 rounded-lg font-bold text-sm text-gray-600 hover:bg-gray-200">Batal</button>
            <button form="tripForm" type="submit" disabled={isLoading} className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-green-700 shadow-md">
                {isLoading ? "Menyimpan..." : (tripToEdit ? "Simpan Perubahan" : "Terbitkan")}
            </button>
        </div>
      </div>
    </div>
  );
}