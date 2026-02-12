import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  // 1. If no header, return null immediately (User is likely guest)
  if (!authHeader) {
    return NextResponse.json({ booking: null });
  }

  const token = authHeader.replace("Bearer ", "");

  // 2. Create a client specifically for this user context
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Use ANON key, not Service Role
    {
      global: {
        headers: { Authorization: `Bearer ${token}` }, // Attach the user's token
      },
    }
  );

  // 3. Verify the token by asking Supabase "Who is this?"
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    // If the token is invalid, return null instead of crashing
    // This prevents the frontend from freaking out
    return NextResponse.json({ booking: null }, { status: 401 });
  }

  // 4. Now use the Admin/Service client ONLY for fetching the data 
  // (Since we confirmed the user is real)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: booking } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "Confirmed")
    .single();

  return NextResponse.json({ booking });
}