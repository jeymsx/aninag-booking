import Link from "next/link";



export default function Home() {
  
  return (
    <div className="min-h-screen bg-white flex flex-col relative selection:bg-[#FCC200] selection:text-[#700000]">
      
      {/* Optional: Very subtle top gradient to hint at the green brand color without overwhelming the white */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#013220]/5 to-transparent pointer-events-none" />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        
        <div className="text-center space-y-8 max-w-4xl w-full">
          
          {/* 1. The Wordmark Logo */}
          <div className="relative animate-in fade-in zoom-in duration-1000 px-4">
            {/* Make sure 'Wordmark.jpg' is in your /public folder.
              I added a subtle mix-blend mode just in case the jpg has a background, 
              though a transparent PNG works best here.
            */}
            <img 
              src="/website-hero.png" 
              alt="Aninag 2026 Wordmark" 
              className="w-full max-w-md md:max-w-xl mx-auto h-auto object-contain hover:scale-[1.01] transition-transform duration-500"
            />
          </div>

          {/* 2. Minimalist Text Content */}
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            <h2 className="text-[#700000] font-bold tracking-[0.25em] uppercase text-xs md:text-sm">
              Schedule Your Graduation Photoshoot
            </h2>
          </div>

          {/* 3. Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            {/* Primary: Forest Green filled */}
            <Link
              href="/book"
              className="px-10 py-3 bg-[#013220] text-white rounded-full font-bold tracking-wide shadow-lg hover:bg-[#0a442e] hover:shadow-xl transition-all hover:-translate-y-0.5 min-w-[200px]"
            >
              Book Your Session
            </Link>

            {/* Secondary: Clean Outline */}
            <Link
              href="/packages"  // <--- Update this link
              className="px-10 py-3 border border-gray-200 text-gray-500 rounded-full font-medium tracking-wide hover:border-[#700000] hover:text-[#700000] transition-all bg-white min-w-[200px]"
            >
              View Packages
            </Link>
          </div>

        </div>
      </main>

      {/* Footer Branding - Minimalist & Centered */}
      <footer className="py-10 text-center space-y-4">
        {/* Decorative Gold Dash */}
        <div className="w-12 h-1 bg-[#FCC200] mx-auto rounded-full opacity-80" />
        
        <div className="flex justify-center items-center gap-6 text-[10px] md:text-xs font-bold tracking-widest uppercase text-[#700000]/70">
           <span className="flex items-center gap-1">
             {/* Facebook Icon SVG */}
             <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
             /aninag2026
           </span>
           <span className="flex items-center gap-1">
             {/* Instagram/Mail Icon SVG */}
             <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z"/></svg>
             aninag2026@gmail.com
           </span>
        </div>

        <p className="text-gray-300 text-[10px] uppercase tracking-[0.3em]">
          Official Graduation Portraiture
        </p>
      </footer>
    </div>
  );
}