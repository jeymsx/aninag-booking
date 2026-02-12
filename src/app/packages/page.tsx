"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";


const totalPhotos = 12;
const photos = Array.from({ length: totalPhotos }, (_, i) => ({
  id: i + 1,
  src: `/lookbook/${i + 1}.jpg`, 
  alt: `Aninag 2026 Package Slide ${i + 1}`,
}));

export default function PackagesPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [backPath, setBackPath] = useState("/"); // Default to landing

  useEffect(() => {
    // Determine the back path based on auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setBackPath("/book");
      } else {
        setBackPath("/");
      }
    });
  }, []);

  const prevSlide = () => {
    const isFirst = currentIndex === 0;
    const newIndex = isFirst ? photos.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLast = currentIndex === photos.length - 1;
    const newIndex = isLast ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-[#FCC200] selection:text-[#700000] relative">
      
      {/* --- NEW RETURN BUTTON --- */}
      <Link 
        href={backPath} 
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-gray-400 hover:text-[#700000] transition-colors group"
      >
        <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#700000] bg-white shadow-sm">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
          {backPath === "/book" ? "Back to Booking" : "Return Home"}
        </span>
      </Link>

      {/* --- MAIN GALLERY --- */}
      <main className="flex-1 flex flex-col items-center justify-center py-8 px-4 relative">
        
        {/* Square Container */}
        <div className="relative w-full max-w-lg aspect-square bg-gray-50 shadow-2xl shadow-gray-200/50 rounded-sm overflow-hidden ring-1 ring-gray-100 group">
          
          {/* Main Image */}
          <img 
            src={photos[currentIndex].src} 
            alt={photos[currentIndex].alt}
            className="w-full h-full object-cover animate-in fade-in zoom-in duration-500 key={currentIndex}"
          />

          {/* Navigation Arrows (Hidden until hover on desktop) */}
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={prevSlide}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/90 text-[#013220] hover:scale-110 transition-transform shadow-lg backdrop-blur-sm"
            >
              ←
            </button>
            <button 
              onClick={nextSlide}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/90 text-[#013220] hover:scale-110 transition-transform shadow-lg backdrop-blur-sm"
            >
              →
            </button>
          </div>

          {/* Mobile Tap Areas (Invisible) */}
          <div className="md:hidden absolute inset-0 flex">
            <div onClick={prevSlide} className="w-1/2 h-full" />
            <div onClick={nextSlide} className="w-1/2 h-full" />
          </div>

        </div>

        {/* Counter / Caption */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-[#700000] font-serif font-bold text-xl">
            Packages Showcase
          </p>
          <div className="inline-block px-4 py-1 bg-gray-100 rounded-full text-[10px] font-bold tracking-widest text-gray-500 uppercase">
            {currentIndex + 1} / {totalPhotos}
          </div>
        </div>

      </main>

      {/* --- MINIMALIST THUMBNAILS --- */}
      <div className="h-20 w-full overflow-x-auto pb-4 px-4 scrollbar-hide">
        <div className="flex justify-center gap-2 min-w-max mx-auto">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => setCurrentIndex(index)}
              className={`relative w-12 h-12 rounded-md overflow-hidden transition-all duration-300 ${
                index === currentIndex 
                  ? "ring-2 ring-[#700000] ring-offset-2 opacity-100 scale-110" 
                  : "opacity-30 hover:opacity-100 grayscale hover:grayscale-0"
              }`}
            >
              <img 
                src={photo.src} 
                alt="Thumbnail" 
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}