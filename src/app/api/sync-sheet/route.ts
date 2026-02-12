import { supabase } from "@/lib/supabase";

async function syncWithRetry(payload: any, retries = 3) {
  for (let i = 1; i <= retries; i++) {
    try {
      const res = await fetch(process.env.GAS_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) return true;
    } catch (err) {
      console.error(`Retry ${i} failed`);
    }

    await new Promise((r) => setTimeout(r, 500));
  }

  return false;
}

export async function POST() {
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .eq("synced", false);

  if (!bookings || bookings.length === 0) {
    return Response.json({ message: "No unsynced bookings" });
  }

  let successCount = 0;

  for (const booking of bookings) {
    const payload = {
    id: booking.id,
    type: booking.type,
    date: booking.date,
    time: booking.time,
    name: booking.name,
    email: booking.email,
    mobile: booking.mobile,
    packageName: booking.package,   // 🔥 map correctly
    addOns: booking.addons,         // 🔥 map correctly
    makeup: booking.makeup,
    remarks: booking.remarks,
    status: booking.status,
    };

    const success = await syncWithRetry(payload, 3);


    if (success) {
      await supabase
        .from("bookings")
        .update({ synced: true })
        .eq("id", booking.id);

      successCount++;
    }
  }

  return Response.json({
    message: `Synced ${successCount} bookings`,
  });
}
