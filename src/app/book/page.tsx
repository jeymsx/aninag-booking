"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import BookingCalendar from "@/components/BookingCalendar";
import Header from "@/components/Header";

export default function BookPage() {
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // New state for rescheduling loading
  const [rescheduling, setRescheduling] = useState(false);

  // Fetch user's booking
  const fetchBooking = async (session: any) => {
    try {
      const res = await fetch("/api/my-booking", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await res.json();
      setBooking(data.booking || null);
    } catch (error) {
      console.error("Error fetching booking:", error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      if (session) {
        setCheckingAuth(false);
        await fetchBooking(session);
        setLoading(false);
      } else if (!session && !checkingAuth) {
        router.replace("/login");
      }
    });

    // Initial check fallback
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && mounted) {
        setTimeout(() => {
             supabase.auth.getSession().then(({ data: { session: final } }) => {
                 if (!final && mounted) router.replace("/login");
             });
        }, 500);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, checkingAuth]);

  // --- RESCHEDULE LOGIC ---
  const handleReschedule = async () => {
    
    setRescheduling(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      // 1. Delete the booking
      const res = await fetch("/api/delete-booking", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();

      if (data.success) {
        // 2. Sync Sheet (Optional, usually handled by API)
        await fetch("/api/sync-sheet", { method: "POST" });
        
        // 3. Clear local state to show calendar again
        setBooking(null);
      } else {
        alert(data.message || "Unable to reschedule");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setRescheduling(false);
    }
  };

  // --- LOADING STATE ---
  if (loading || checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
            <div className="animate-spin w-8 h-8 border-2 border-[#800000] border-t-transparent rounded-full" />
            <p className="text-[#013220] text-xs font-bold tracking-widest uppercase animate-pulse">
                {checkingAuth ? "Verifying Access..." : "Loading Schedule..."}
            </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Header />

      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
        {booking ? (
          /* --- TICKET STYLE CONFIRMATION --- */
          <div className="max-w-xl mx-auto mt-8 animate-in fade-in zoom-in duration-500">
            <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden relative border border-gray-100">
               {/* Decorative "Ticket" Holes */}
               <div className="absolute top-1/2 left-0 w-6 h-6 bg-[#FDFDFD] rounded-full -translate-x-1/2 -translate-y-1/2 border border-gray-100" />
               <div className="absolute top-1/2 right-0 w-6 h-6 bg-[#FDFDFD] rounded-full translate-x-1/2 -translate-y-1/2 border border-gray-100" />
               <div className="absolute top-1/2 left-4 right-4 h-px border-t-2 border-dashed border-gray-200" />

              {/* Top Half: Brand & Status */}
              <div className="bg-[#013220] p-10 text-center text-white relative z-10 pb-16">
                <div className="inline-flex p-3 bg-white/10 rounded-full mb-4">
                    <span className="text-3xl">🎓</span>
                </div>
                <h2 className="text-3xl font-serif font-bold tracking-wide">You're Scheduled</h2>
                <p className="text-white/60 text-sm mt-2 uppercase tracking-widest">Aninag 2026 Yearbook</p>
              </div>

              {/* Bottom Half: Details */}
              <div className="p-10 pt-16 bg-white relative z-10">
                <div className="grid grid-cols-2 gap-y-8 gap-x-4 text-center">
                  {/* DATE */}
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Date</p>
                    <p className="text-xl font-serif font-bold text-[#013220]">
                      {new Date(booking.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {/* TIME */}
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Time</p>
                    <p className="text-xl font-serif font-bold text-[#013220]">
                      {booking.time}
                    </p>
                  </div>

                  {/* STATUS - FULL WIDTH */}
                  <div className="col-span-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Status</p>
                    <span className="inline-block mt-2 px-4 py-1 bg-[#800000]/10 text-[#800000] rounded-full text-xs font-bold uppercase">
                      {booking.status}
                    </span>
                  </div>

                  {/* PACKAGE - FULL WIDTH */}
                  <div className="col-span-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Package</p>
                    <p className="text-sm font-semibold text-gray-800 leading-snug mt-1">
                      {booking.package || "N/A"}
                    </p>
                  </div>

                </div>


                <div className="mt-10 pt-8 border-t border-gray-100 text-center space-y-4">
                    
                    {/* RESCHEDULE BUTTON */}
                    <button
                      onClick={handleReschedule}
                      disabled={rescheduling}
                      className="w-full py-3 border-2 border-gray-100 text-gray-400 rounded-xl font-bold hover:border-[#800000] hover:text-[#800000] hover:bg-white transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      {rescheduling ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#800000] border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Reschedule Appointment"
                      )}
                    </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* --- SCHEDULER VIEW --- */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-3 mb-10">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#013220]">
                Select Your Schedule
              </h1>
              <p className="text-gray-500 max-w-xl mx-auto text-base md:text-lg">
                Choose a date from the calendar, then pick an available time slot on the right.
              </p>
            </div>

            <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
              <BookingCalendar
                onBooked={() => {
                  supabase.auth.getSession().then(({ data: { session } }) => {
                    if (session) fetchBooking(session);
                  });
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}