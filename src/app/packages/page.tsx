"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Photo { id: number; src: string; alt: string; }
interface FAQQuestion { q: string; a: string; }
interface FAQCategory { category: string; questions: FAQQuestion[]; }

const totalPhotos = 12;
const photos: Photo[] = Array.from({ length: totalPhotos }, (_, i) => ({
  id: i + 1,
  src: `/lookbook/${i + 1}.jpg`,
  alt: `Aninag 2026 Service Slide ${i + 1}`,
}));

const faqData: FAQCategory[] = [
  {
    category: "General FAQs",
    questions: [
      {
        q: "Does Aninag only accept one-time payments?",
        a: "No. Aninag offers two types of payment schemes. One for full payments. Two for a two-time payment scheme, where 50% shall be paid upon order and the rest will be paid before your scheduled shoot date."
      },
      {
        q: "Can I avail Aninag Services even if I am from a different college?",
        a: "YES. Aninag 2026 is accepting subscribers from other colleges, particularly for Graduation Shoot Services and Sablay."
      },
      {
        q: "Can I upgrade my packages?",
        a: "Yes, you can upgrade your packages based on the additional and optional services provided by ANINAG."
      },
      {
        q: "Can I place a new order to avail another service after I have already placed my order for one?",
        a: "Yes, you can place a new order but ensure that the new form only contains the additional service that you will be availing aside from the initial order form that you have submitted. All orders submitted are considered final."
      },
      {
        q: "What is the hair and makeup to be paid for under “Other Optional Services” in the Google Forms?",
        a: "Yes. All Graduation Shoot Package and Bundle Deals are already inclusive of Hair and Make-up. Such services are only for individuals who did not avail any Graduation Shoot Package and Bundle Deals but would like to avail them on the Barkada Packages."
      }
    ]
  },
  {
    category: "Photoshoot Queries",
    questions: [
      {
        q: "What do I wear to the shoot?",
        a: "Women: Tube top (preferably white or nude color). Men: Plain white shirt (either v-neck or round neck). You may opt to bring your own Filipiniana or Barong."
      },
      {
        q: "Do I have to bring props and costumes for my shoot?",
        a: "Zone 5 has readily available items for FREE USE such as the toga, sablay, formal wear, and other props for both in-studio and in-campus shoots. However, we recommend bringing your own props and photo pegs for your creative shot."
      },
      {
        q: "Can I do my own make-up or bring my own make-up artist?",
        a: "Yes you can, but you cannot use the studio's make-up room. All graduation photo packages come with basic hair and make-up courtesy of Zone 5's in-house staff."
      },
      {
        q: "Where will we have our photoshoot?",
        a: "Aninag 2026 and Zone 5 will be offering both in-studio (at Zone 5’s studio in Quezon City) and in-campus photoshoot services—all catered to your convenience."
      },
      {
        q: "When is the graduation photoshoot?",
        a: "The graduation shoot will be held on the second and third week of March."
      },
      {
        q: "Can I bring my pet/s for the creative shot portion of the photoshoot?",
        a: "Small pets are permitted during in-studio shoots for creative shots but are not allowed during in-campus shoots due to university protocols."
      },
      {
        q: "Are the Barkada Packages only for graduating students?",
        a: "We do not impose strict limitations on the composition of participants included in the Barkada Shots. Participants may come from different year levels, degree programs, colleges, or even from outside UP Manila, provided that the total number of participants falls within the number of pax covered by the availed barkada package. One must ensure that there is at least one paying subscriber and everyone joining will go to the scheduled shoot date of the one that is paying."
      },
      {
        q: "What happens if I miss my time slot but am present on the day of my scheduled graduation shoot?",
        a: "You will still be accommodated. However, you must now wait for everyone else to finish their respective shoots. As such, you are advised to arrive in the studio/room 30 minutes before your time slot."
      },
      {
        q: "What happens if I miss my shoot date?",
        a: "Aninag will schedule you on an available date for our exclusive photo shoots, whether in-campus or in-studio. If none of the listed dates work for you, we will assist in arranging a shoot at the Zone 5 Studio."
      }
    ]
  }
];


export default function ServicesPage() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [backPath, setBackPath] = useState<string>("/");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setBackPath(session ? "/book" : "/");
    });
  }, []);

  const toggleFaq = (id: string) => setOpenFaq(openFaq === id ? null : id);

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-[#FCC200] selection:text-[#700000] relative">
      
      {/* --- RETURN BUTTON (Fixed position to avoid content clash) --- */}
      <Link 
        href={backPath} 
        className="fixed top-8 left-8 z-50 flex items-center gap-3 text-gray-400 hover:text-[#700000] transition-all group bg-white/80 backdrop-blur-md p-2 rounded-full md:bg-transparent md:p-0"
      >
        <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#700000] bg-white shadow-sm transition-colors">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
          {backPath === "/book" ? "Booking" : "Home"}
        </span>
      </Link>

      {/* --- MAIN GALLERY STAGE --- */}
      <main className="flex-1 flex flex-col items-center pt-32 pb-12 px-6 relative max-w-5xl mx-auto w-full">
        
        {/* Header Content */}
        <div className="w-full max-w-2xl flex justify-between items-end mb-10 border-b border-gray-100 pb-6">
          <div className="space-y-1">
            <span className="text-[11px] uppercase font-bold tracking-[0.4em] text-[#FCC200]">Aninag 2026</span>
            <h1 className="text-[#700000] font-serif font-bold text-4xl italic leading-tight">Service Offerings</h1>
          </div>
          <div className="text-right pb-1">
            <span className="text-lg font-serif italic text-[#700000]">{currentIndex + 1}</span>
            <span className="text-gray-300 mx-3 text-sm">/</span>
            <span className="text-xs font-bold text-gray-400 tracking-widest">{totalPhotos}</span>
          </div>
        </div>

        {/* Image Display */}
        <div className="relative group w-full max-w-2xl">
          <div 
            onClick={() => setIsLightboxOpen(true)}
            className="relative aspect-square bg-gray-50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] rounded-sm overflow-hidden ring-1 ring-black/5 cursor-zoom-in transition-transform duration-500 hover:scale-[1.01]"
          >
            <img 
              key={currentIndex}
              src={photos[currentIndex].src} 
              alt={photos[currentIndex].alt}
              className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-1000"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 flex items-center justify-center">
            </div>
          </div>

          {/* Controls */}
          <div className="absolute -bottom-8 right-8 flex gap-3 z-20">
            <button 
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => (prev === 0 ? photos.length - 1 : prev - 1)); }}
              className="w-16 h-16 flex items-center justify-center bg-white text-[#700000] shadow-2xl hover:bg-[#700000] hover:text-white transition-all duration-300 rounded-full border border-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => (prev === photos.length - 1 ? 0 : prev + 1)); }}
              className="w-16 h-16 flex items-center justify-center bg-[#700000] text-white shadow-2xl hover:bg-[#500000] transition-all duration-300 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>

        {/* --- SQUARE THUMBNAIL FILMSTRIP --- */}
        <div className="mt-24 w-full max-w-3xl overflow-visible">
          <div className="flex items-center gap-6 mb-6">
            <div className="h-[1px] flex-1 bg-gray-100" />
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-gray-400">Gallery Overview</span>
            <div className="h-[1px] flex-1 bg-gray-100" />
          </div>
          
          <div className="flex justify-start md:justify-center gap-4 overflow-x-auto py-6 scrollbar-hide px-4">
            {photos.map((photo, index) => (
              <button 
                key={photo.id} 
                onClick={() => setCurrentIndex(index)} 
                className={`relative flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden transition-all duration-500 ${
                  index === currentIndex 
                  ? "ring-2 ring-[#700000] ring-offset-4 scale-110 z-10 shadow-lg" 
                  : "opacity-40 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-105"
                }`}
              >
                <img src={photo.src} alt="Thumbnail" className="w-full h-full object-cover" />
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-[#700000]/5 animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* --- LIGHTBOX MODAL --- */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button className="absolute top-10 right-10 text-gray-400 hover:text-[#700000] transition-colors p-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <div className="max-w-4xl w-full aspect-square relative shadow-2xl">
            <img 
              src={photos[currentIndex].src} 
              alt="Fullscreen view" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* --- FAQ SECTION --- */}
      <section className="max-w-3xl mx-auto w-full px-6 py-32 border-t border-gray-100 bg-gray-50/30">
        <div className="text-center mb-20">
          <h2 className="text-[#700000] font-serif font-bold text-5xl mb-4 italic tracking-tight">Essential FAQ</h2>
          <p className="text-gray-400 text-[11px] uppercase tracking-[0.4em] font-bold">Important Details for your session</p>
        </div>
        
        <div className="space-y-20">
          {faqData.map((cat, catIdx) => (
            <div key={catIdx}>
              <div className="flex items-center gap-6 mb-10">
                <h3 className="text-gray-900 font-bold text-xs uppercase tracking-[0.3em] whitespace-nowrap">{cat.category}</h3>
                <div className="h-[1.5px] w-full bg-[#700000]/10" />
              </div>

              <div className="space-y-3">
                {cat.questions.map((item, qIdx) => {
                  const uniqueId = `${catIdx}-${qIdx}`;
                  const isOpen = openFaq === uniqueId;
                  return (
                    <div
                      key={uniqueId}
                      className={`transition-all duration-500 rounded-xl ${
                        isOpen ? "bg-white shadow-xl shadow-gray-200/40" : "bg-transparent hover:bg-white/50"
                      }`}
                    >
                      <button
                        onClick={() => toggleFaq(uniqueId)}
                        className="w-full flex justify-between items-start text-left p-6 group"
                      >
                        <span
                          className={`font-serif font-bold text-xl transition-colors pr-4 flex-1 ${
                            isOpen ? "text-[#700000]" : "text-gray-800 group-hover:text-[#700000]"
                          }`}
                        >
                          {item.q}
                        </span>
                        
                        {/* Fixed-size container for the plus icon */}
                        <div className="flex-shrink-0 mt-1">
                          <div
                            className={`relative w-6 h-6 flex items-center justify-center transition-transform duration-500 ${
                              isOpen ? "rotate-[225deg]" : ""
                            }`}
                          >
                            <div className="absolute w-full h-[2px] bg-[#700000] rounded-full" />
                            <div className="absolute h-full w-[2px] bg-[#700000] rounded-full" />
                          </div>
                        </div>
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-8 -mt-2 animate-in fade-in slide-in-from-top-3 duration-500">
                          <div className="text-gray-600 leading-relaxed text-[16px] max-w-[90%]">
                            {item.a}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}