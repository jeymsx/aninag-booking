"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; 
import FloatingBooking from "@/components/FloatingBooking";
import { ChevronDown, X, Calendar } from "lucide-react"; 
import { GALLERY_PHOTOS } from "@/lib/photos";

// --- UPDATED SUB-COMPONENT WITH MOBILE BORDER FIX ---
const GalleryItem = ({ 
  photo, 
  onClick 
}: { 
  photo: { id: number; src: string; alt: string }; 
  onClick: (src: string) => void;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div 
      onClick={() => onClick(photo.src)}
      className="relative break-inside-avoid mb-2 sm:mb-4 overflow-hidden rounded-lg cursor-zoom-in group bg-gray-100"
      // 🟢 FIX: This style forces mobile browsers to respect border-radius during transforms
      style={{ 
        WebkitMaskImage: "-webkit-radial-gradient(white, black)",
        maskImage: "radial-gradient(white, black)"
      }}
    >
      {/* SKELETON LOADER: Visible only while loading */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />
      )}

      <Image
        src={photo.src}
        alt={photo.alt}
        width={500} 
        height={500} 
        // Fade in effect when loaded
        className={`w-full h-auto object-cover rounded-lg transition-all duration-700 group-hover:scale-105 ${
          isLoading ? "opacity-0 scale-105" : "opacity-100 scale-100"
        }`}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        style={{ width: '100%', height: 'auto' }}
        onLoad={() => setIsLoading(false)} 
      />
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
        <div className="bg-white/90 px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-black">
          View
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const router = useRouter();
  const galleryRef = useRef<HTMLDivElement>(null);
  
  // --- STATE ---
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // --- AUTH CHECK ---
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("error") === "not_whitelisted") {
      setErrorMessage("Access Restricted: Your email is not on the confirmed photoshoot list.");
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from("admin_users").select("email").eq("email", user.email).single()
          .then(({ data }) => setIsAdmin(!!data));
      }
    });
  }, []);

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBookingAction = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user?.email) {
        const { data: user, error: whitelistError } = await supabase
          .from("whitelisted_users")
          .select("email")
          .eq("email", session.user.email)
          .maybeSingle();

        if (whitelistError) throw whitelistError;

        if (user) {
          router.push("/book");
          return;
        }

        await supabase.auth.signOut();
        setErrorMessage("Access Restricted: Your email is not on the confirmed photoshoot list.");
        return;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/verify-access`,
          queryParams: {
            hd: "up.edu.ph",
            prompt: "select_account",
          },
        },
      });

      if (error) throw error;

    } catch (err) {
      console.error(err);
      setErrorMessage("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative w-full max-w-[100vw] overflow-x-hidden selection:bg-[#FCC200] selection:text-[#700000]">
      
      {/* --- HERO SECTION --- */}
      <main className="h-screen flex flex-col items-center justify-center px-6 relative z-10 shrink-0 w-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#013220]/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#800000]/5 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="text-center space-y-8 max-w-2xl w-full">

           {/* 1. Wordmark */}
           <div className="relative animate-in fade-in zoom-in duration-1000">
             <img src="/website-hero.png" alt="Aninag 2026 Wordmark" className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-700 ease-out drop-shadow-sm" />
           </div>

           {/* 2. Label */}
           <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
             <h2 className="text-[#700000] font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs">
               Schedule Your Graduation Photoshoot
             </h2>
             <div className="w-8 h-0.5 bg-[#FCC200] mx-auto rounded-full" />
           </div>

           {errorMessage && (
             <div className="max-w-md mx-auto p-4 bg-[#800000]/5 border border-[#800000]/20 rounded-2xl text-[#800000] text-sm font-medium animate-in fade-in duration-300">
               {errorMessage}
             </div>
           )}

           {/* 3. Actions */}
          <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
              
              <button
                onClick={handleBookingAction}
                disabled={loading}
                className="px-10 py-3.5 bg-[#013220] text-white rounded-full font-medium text-sm tracking-wide shadow-xl hover:shadow-[#013220]/20 hover:bg-[#0a442e] transition-all active:scale-95 disabled:opacity-70 min-w-[200px] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Book Your Session"
                )}
              </button>
              
              <Link
                href="/schedules"
                className="px-10 py-3.5 bg-[#FCC200] text-[#700000] rounded-full font-medium text-sm tracking-wide shadow-md hover:shadow-[#FCC200]/30 hover:bg-[#ffcf33] transition-all min-w-[200px] text-center flex items-center justify-center gap-2 active:scale-95"
              >
                <Calendar size={16} className="text-[#700000]" />
                See Available Schedules
              </Link>
            </div>

            <Link
              href="/packages"
              className="text-sm font-medium text-gray-500 hover:text-[#013220] underline underline-offset-4 decoration-gray-300 hover:decoration-[#013220] transition-all"
            >
              View FAQs & Services
            </Link>

          </div>
        </div>

        {isAdmin && (
           <Link href="/admin" className="mt-6 text-[10px] font-bold text-[#800000] underline tracking-widest">EB ADMIN DASHBOARD</Link>
        )}

        <button onClick={scrollToGallery} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-gray-400 hover:text-[#700000] transition-colors animate-bounce cursor-pointer">
          <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Explore Gallery</span>
          <ChevronDown size={20} />
        </button>
      </main>

      {/* --- GALLERY SECTION --- */}
      <section ref={galleryRef} className="w-full px-2 sm:px-4 py-24 bg-neutral-50 min-h-screen">
        <div className="max-w-[1600px] mx-auto space-y-12">
          
          <div className="text-center space-y-4">
             <h3 className="text-[#013220] font-bold text-2xl tracking-widest uppercase">Sample Photos</h3>
             <div className="w-12 h-1 bg-[#FCC200] mx-auto" />
          </div>

          {/* MASONRY GRID - LOAD ALL */}
          <div className="columns-2 sm:columns-3 lg:columns-5 xl:columns-6 gap-2 sm:gap-4 space-y-2 sm:space-y-4">
            {GALLERY_PHOTOS.map((photo) => (
              <GalleryItem 
                key={photo.id} 
                photo={photo} 
                onClick={setSelectedImage} 
              />
            ))}
          </div>

          <div className="text-center pt-8 pb-4">
            <span className="text-gray-300 text-[10px] tracking-widest uppercase">
              — End of Gallery —
            </span>
          </div>

        </div>
      </section>

      {/* --- LIGHTBOX --- */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full z-50">
            <X size={32} />
          </button>
          <img 
            src={selectedImage} 
            className="max-w-full max-h-[90vh] object-contain rounded shadow-2xl animate-in zoom-in-95 duration-300" 
            alt="Fullscreen preview"
          />
        </div>
      )}
      
      <FloatingBooking />
    </div>
  );
}