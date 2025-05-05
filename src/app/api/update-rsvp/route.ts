import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Define the structure for the update RSVP request
interface RsvpData {
  uuid: string;
  rsvp: boolean;
  dessert_choice?: string | null;
  dessert_topping?: string | null;
  allergies?: string | null;
}

// GET method: Fetch RSVP data
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

// POST method: Update RSVP
export async function POST(req: Request) {
  const body: RsvpData = await req.json();

  if (!body.uuid) {
    return NextResponse.json({ error: "Missing UUID" }, { status: 400 });
  }

  // Fetch the original RSVP for validation
  const { data: original, error: fetchError } = await supabase
    .from("rsvps")
    .select("uuid, name, email")
    .eq("uuid", body.uuid)
    .single();

  if (fetchError || !original) {
    return NextResponse.json({ error: "Could not find original RSVP" }, { status: 500 });
  }

  // Update the RSVP
  const { error: updateError } = await supabase
    .from("rsvps")
    .update({
      rsvp: body.rsvp,
      dessert_choice: body.rsvp ? body.dessert_choice : null,
      dessert_topping: body.rsvp ? body.dessert_topping : null,
      allergies: body.rsvp ? body.allergies : null,
    })
    .eq("uuid", body.uuid);

  if (updateError) {
    return NextResponse.json({ error: "Failed to update RSVP" }, { status: 500 });
  }

  const isAttending = body.rsvp === true;
  const updateLink = `http://vanrileywedding.co.uk/update-rsvp?uuid=${body.uuid}`;

  try {
    // Send email to admin
    await resend.emails.send({
      from: "Van-Riley Wedding RSVP <rsvp@vanrileywedding.co.uk>",
      to: "abigail.ridley@hotmail.co.uk",
      subject: "RSVP Updated",
      html: `
        <p><strong>${original.name}</strong> has updated their RSVP.</p>
        <p><strong>Attending:</strong> ${isAttending ? "Yes" : "No"}</p>
        ${isAttending ? `
          <p><strong>Dessert:</strong> ${body.dessert_choice || "N/A"}</p>
          <p><strong>Topping:</strong> ${body.dessert_topping || "None"}</p>
          <p><strong>Allergies:</strong> ${body.allergies || "None"}</p>
        ` : ""}
      `,
    });

    // Send confirmation email to guest
    await resend.emails.send({
      from: "Van-Riley Wedding RSVP <rsvp@vanrileywedding.co.uk>",
      to: original.email,
      subject: "Your RSVP has been updated",
      html: `
        <p>Hi ${original.name},</p>
        <p>We’ve updated your RSVP — thank you!</p>
        <p>If you ever need to make further changes, just use this link:</p>
        <p><a href="${updateLink}">${updateLink}</a></p>
        <p>See you soon! 💕</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (emailError) {
    console.error("Email sending error:", emailError);
    return NextResponse.json({ error: "RSVP updated, but email failed" }, { status: 500 });
  }
}