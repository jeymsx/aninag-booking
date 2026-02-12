"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const initialize = async () => {
      // Force Supabase to process OAuth hash and store session
      await supabase.auth.getSession();

      // Clean up the URL if it contains access_token
      if (window.location.hash.includes("access_token")) {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    };

    initialize();
  }, []);

  return <>{children}</>;
}
