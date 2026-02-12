import { supabase } from "@/lib/supabase";

const TIMES = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
];

const CAPACITY_PER_SLOT = 6;

const STUDIO_DATES = [
  "2026-03-12",
  "2026-03-13",
  "2026-03-14",
  "2026-03-20",
  "2026-03-21",
];

const LOCATION_DATES = [
  "2026-03-16",
  "2026-03-17",
  "2026-03-18",
  "2026-03-19",
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  if (!type) {
    return Response.json({ error: "Missing type" }, { status: 400 });
  }

  const validDates =
    type === "studio" ? STUDIO_DATES : LOCATION_DATES;

  const { data, error } = await supabase
    .from("bookings")
    .select("date, time")
    .eq("type", type)
    .eq("status", "Confirmed");


  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const countMap: Record<string, number> = {};

  data?.forEach((row) => {
    const key = `${row.date}_${row.time}`;
    countMap[key] = (countMap[key] || 0) + 1;
  });

  const result = validDates.map((date) => {
    let totalRemaining = 0;

    TIMES.forEach((time) => {
      const booked = countMap[`${date}_${time}`] || 0;
      totalRemaining += CAPACITY_PER_SLOT - booked;
    });

    return {
      date,
      remaining: totalRemaining,
    };
  });

  return Response.json(result);
}
