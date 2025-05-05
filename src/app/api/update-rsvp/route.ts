import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// Define the structure for the update RSVP request
interface RsvpData {
  uuid: string;
  rsvp: boolean;
  dessert_choice?: string | null;
  dessert_topping?: string | null;
  allergies?: string | null;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const uuid = url.searchParams.get("uuid");

  if (!uuid) {
    return NextResponse.json({ error: "UUID is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("rsvps")
    .select("uuid, name, rsvp, dessert_choice, dessert_topping, allergies")
    .eq("uuid", uuid)
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to retrieve RSVP" }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const body: RsvpData = await req.json();

  if (!body.uuid) {
    return NextResponse.json({ error: "Missing UUID" }, { status: 400 });
  }

  const { error } = await supabase
    .from("rsvps")
    .update({
      rsvp: body.rsvp,
      dessert_choice: body.rsvp ? body.dessert_choice : null,
      dessert_topping: body.rsvp ? body.dessert_topping : null,
      allergies: body.rsvp ? body.allergies : null,
    })
    .eq("uuid", body.uuid);

  if (error) {
    return NextResponse.json({ error: "Failed to update RSVP" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}