import { createClient } from "@supabase/supabase-js";

export async function DELETE(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return Response.json({ success: false });
  }

  const token = authHeader.replace("Bearer ", "");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  if (!user) {
    return Response.json({ success: false });
  }

  const { error } = await supabase
  .from("bookings")
  .update({
    status: "Cancelled",
    synced: false, // 🔥 VERY IMPORTANT
  })
  .eq("user_id", user.id)
  .eq("status", "Confirmed");


  if (error) {
    return Response.json({ success: false });
  }

  return Response.json({ success: true });
}
