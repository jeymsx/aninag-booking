"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Initial load
    supabase.auth.getUser().then(({ data }) => {
        setEmail(data.user?.email ?? null);
    });

    // Listen for login/logout changes
    const {
        data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
        setEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // CHANGED: Redirect to Landing Page instead of Login
    router.replace("/");
  };

  return (
    <header className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        
        {/* Left: Branding with Real Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="Aninag 2026 Logo" 
            className="h-10 w-auto object-contain group-hover:opacity-80 transition-opacity"
          />
          
          <div className="hidden sm:flex flex-col leading-none border-l border-gray-200 pl-3">
            <span className="text-lg font-serif font-bold text-[#013220] tracking-tight">
              Aninag <span className="text-[#800000]">2026</span>
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold">
              Scheduler
            </span>
          </div>
        </Link>

        {/* Right: Nav + User + Logout */}
        <div className="flex items-center gap-4 sm:gap-6">
     

          {/* --- PACKAGES LINK --- */}
          <Link 
            href="/packages"
            className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#013220] hover:text-[#800000] transition-colors"
          >
            Services
          </Link>

          {email && (
            <div className="hidden sm:flex flex-col items-end border-l border-gray-200 pl-6">
              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">
                  Logged in
              </span>
              <span className="text-xs font-medium text-gray-600 truncate max-w-[120px]">
                  {email}
              </span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 border-2 border-gray-50 text-gray-500 rounded-full hover:border-[#800000] hover:text-[#800000] transition-all active:scale-95"
          >
            Logout
          </button>
        </div>

      </div>
    </header>
  );
}