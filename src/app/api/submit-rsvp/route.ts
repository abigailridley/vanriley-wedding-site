import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();

  // Clear optional fields if not attending
  const isAttending = body.rsvp === true;

  // 1. Insert the RSVP into Supabase
  const { data, error } = await supabase
    .from("rsvps")
    .insert({
      name: body.name,
      email: body.email,
      rsvp: body.rsvp,
      dessert_choice: isAttending ? body.dessert_choice : null,
      dessert_topping: isAttending ? body.dessert_topping : null,
      allergies: isAttending ? body.allergies : null,
    })
    .select("uuid")
    .single();

  if (error || !data?.uuid) {
    console.error("Database insert error:", error);
    return NextResponse.json({ error: "Failed to save RSVP" }, { status: 500 });
  }

  const uuid = data.uuid;
  const updateLink = `http://localhost:3000/update-rsvp?uuid=${uuid}`;

  // 3. Send emails
  try {
    // Admin email
    await resend.emails.send({
      from: "RSVP Bot <onboarding@resend.dev>",
      to: "abigail.ridley@hotmail.co.uk",
      subject: "New RSVP Submission",
      html: `
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Attending:</strong> ${isAttending ? "Yes" : "No"}</p>
        ${isAttending ? `
          <p><strong>Dessert:</strong> ${body.dessert_choice || "N/A"}</p>
          <p><strong>Topping:</strong> ${body.dessert_topping || "None"}</p>
          <p><strong>Allergies:</strong> ${body.allergies || "None"}</p>
        ` : ""}
      `,
    });

    // Guest confirmation email
    await resend.emails.send({
      from: "RSVP Bot <onboarding@resend.dev>",
      to: body.email,
      subject: "Thanks for your RSVP!",
      html: `
        <p>Hi ${body.name},</p>
        <p>Thanks for submitting your RSVP.</p>
        <p>If you need to update your response, you can do so using the link below:</p>
        <p><a href="${updateLink}">Update my RSVP</a></p>
        <p>See you soon! 💕</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (emailError) {
    console.error("Email sending error:", emailError);
    return NextResponse.json({ error: "RSVP saved, but email failed" }, { status: 500 });
  }
}