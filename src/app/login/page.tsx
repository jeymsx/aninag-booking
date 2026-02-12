"use client";

import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side: Visual Branding (Forest Green) */}
      <div className="hidden lg:flex w-1/2 bg-[#013220] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          {/* Subtle pattern or texture could go here */}
          <div className="w-full h-full border-[40px] border-white rounded-full translate-x-1/2 -translate-y-1/2" />
        </div>
        
        <div className="relative z-10 text-center">
          <h2 className="text-white text-5xl font-serif font-bold mb-4">Aninag 2026</h2>
          <p className="text-white/80 text-lg max-w-md">
            UP Manila College of Arts and Sciences Batch 2026 Yearbook Committee
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center lg:text-left">
            <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-white uppercase bg-[#800000] rounded-full">
              Scheduler
            </div>
            <h1 className="text-4xl font-serif font-bold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-gray-600">
              Sign in to manage or book your graduation shoot.
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <button
              onClick={handleGoogleLogin}
              className="group relative w-full flex justify-center py-4 px-4 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] transition-all duration-200 shadow-sm"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </span>
              Continue with Google
            </button>
          </div>

          <footer className="mt-12 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Aninag 2026</p>
          </footer>
        </div>
      </div>
    </div>
  );
}