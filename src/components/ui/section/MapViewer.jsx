"use client";

import { useState } from "react";

export default function MapViewer({ mapUrl }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!mapUrl) {
    return (
      <div className="h-48 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 text-xs text-center border border-gray-200">
        Data Peta Belum Tersedia
      </div>
    );
  }

  return (
    <>
      <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100 group bg-gray-100">

        <iframe
          src={mapUrl}
          className="w-full h-full object-cover"
          frameBorder="0"
          allowFullScreen
        ></iframe>

        <button
          onClick={() => setIsOpen(true)}
          className="absolute top-2 right-2 bg-white/80 backdrop-blur text-gray-700 p-1.5 rounded-lg shadow-sm border border-gray-200 hover:bg-white transition z-10"
          title="Perbesar Peta"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9"></polyline>
            <polyline points="9 21 3 21 3 15"></polyline>
            <line x1="21" y1="3" x2="14" y2="10"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-9999 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          
          <div className="bg-white w-full h-full max-w-7xl max-h-[90vh] rounded-2xl overflow-hidden relative shadow-2xl flex flex-col">
            
            <div className="bg-white px-4 py-3 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                🗺️ Peta Jalur 3D
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 p-2 rounded-full transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="flex-1 w-full h-full bg-gray-50 relative">
               <iframe
                src={mapUrl}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          
          <div className="absolute inset-0 -z-10" onClick={() => setIsOpen(false)}></div>
        </div>
      )}
    </>
  );
}