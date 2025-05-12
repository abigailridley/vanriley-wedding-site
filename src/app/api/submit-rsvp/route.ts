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
  const updateLink = `http://vanrileywedding.co.uk/update-rsvp?uuid=${uuid}`;

  // 3. Send emails
  try {
    // Admin email
    await resend.emails.send({
      from: "Van-Riley Wedding RSVP <rsvp@vanrileywedding.co.uk>",
      to: "hello@vanrileywedding.co.uk",
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
      from: "Gemma & Ali's Wedding RSVP <rsvp@vanrileywedding.co.uk>",
      to: body.email,
      subject: "Thanks for your RSVP!",
      html: `
        <div style="font-family: 'Georgia', serif; color: #333333; line-height: 1.8; padding: 30px; background-color: #fafafa; border-radius: 10px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0;">
          <h2 style="color: #b94e4d; text-align: center; font-size: 24px;">Thank you for your RSVP, ${body.name}!</h2>
         
          <p style="font-size: 18px; text-align: center;"> ${isAttending ? "We are thrilled to have you join us on our special day!" : "We’re sorry you can’t make it, let us know if anything changes!"}</p>
    
          <h3 style="color: #b94e4d; font-size: 20px;">Your RSVP Details:</h3>
          <ul style="font-size: 16px; list-style-type: none; padding: 0; margin: 0 0 20px;">
          <li><strong>Guest Name:</strong> ${body.name}</li>
            <li><strong>Attending:</strong> ${isAttending ? "Yes" : "No"}</li>
            ${isAttending ? `
              
              <li><strong>Dessert:</strong> ${body.dessert_choice || "N/A"}</li>
              <li><strong>Topping:</strong> ${body.dessert_topping || "None"}</li>
              <li><strong>Allergies:</strong> ${body.allergies || "None"}</li>
            ` : ""}
          </ul>
    
          <p style="font-size: 16px;">If you need to update your response, you can do so using the link below:</p>
          <p style="text-align: center;">
            <a href="${updateLink}" style="background-color: #d86c2b; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Update my RSVP</a>
          </p>
    
          <p style="font-size: 16px; text-align: center; color: #777;">
            ${isAttending ? "We can’t wait to celebrate with you at the wedding!" : "We'll miss you at the wedding, but we hope to see you soon!"}
          </p>
    
          <hr style="border: 1px solid #e0e0e0; margin: 30px 0;"/>
    
          <p style="font-size: 18px; text-align: center; color: #b94e4d;">
            With love,<br/>
            <strong>Gemma & Ali</strong>
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (emailError) {
    console.error("Email sending error:", emailError);
    return NextResponse.json({ error: "RSVP saved, but email failed" }, { status: 500 });
  }
}