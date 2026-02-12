import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// GET method: Fetch RSVP data
export async function GET(req: Request) {
  const url = new URL(req.url);
  // const password = url.searchParams.get("password");

  // if (password !== process.env.WEBSITE_ADMIN_PASSWORD) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const { data, error } = await supabase
    .from("rsvps")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to retrieve RSVP" }, { status: 500 });
  }

  return NextResponse.json({ data: data });
}