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

const dessertChoiceMap: Record<string, string> = {
  chocolate_biscoff: "Chocolate Biscoff Cake",
  lemon: "Lemon Cake",
  fruit: "Fruit Cake",
};

const dessertToppingMap: Record<string, string> = {
  cream: "Cream",
  berries: "Berries",
  berries_cream: "Berries and Cream",
  none: "None",
};

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
  const readableDessert = body.dessert_choice ? dessertChoiceMap[body.dessert_choice] || body.dessert_choice : "N/A";
const readableTopping = body.dessert_topping ? dessertToppingMap[body.dessert_topping] || body.dessert_topping : "None";
  const updateLink = `http://vanrileywedding.co.uk/update-rsvp?uuid=${body.uuid}`;

  try {
    // Send email to admin
    await resend.emails.send({
      from: "Van-Riley Wedding RSVP <rsvp@vanrileywedding.co.uk>",
      to: "hello@vanrileywedding.co.uk",
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
      from: "Gemma & Ali's Wedding RSVP <rsvp@vanrileywedding.co.uk>",
      to: original.email,
      subject: "Your RSVP has been updated",
      html: `
        <div style="font-family: 'Georgia', serif; color: #333333; line-height: 1.8; padding: 30px; background-color: #fafafa; border-radius: 10px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0;">
          <h2 style="color: #b94e4d; text-align: center; font-size: 24px;">Hi ${original.name},</h2>
          
          <p style="font-size: 18px; text-align: center;">We've updated your RSVP — thank you for keeping us informed!</p>
    
          <h3 style="color: #b94e4d; font-size: 20px;">Your RSVP Details:</h3>
          <ul style="font-size: 16px; list-style-type: none; padding: 0; margin: 0 0 20px;">
            <li><strong>Guest Name:</strong> ${original.name}</li>
            <li><strong>Attending:</strong> ${isAttending ? "Yes" : "No"}</li>
            ${isAttending ? `
           <li><strong>Dessert:</strong> ${readableDessert}</li>
<li><strong>Topping:</strong> ${readableTopping}</li>
              <li><strong>Allergies:</strong> ${body.allergies || "None"}</li>
            ` : ""}
          </ul>
    
          <p style="font-size: 16px;">If you ever need to make further changes, you can do so using the link below:</p>
          <p style="text-align: center;">
            <a href="${updateLink}" style="background-color: #d86c2b; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Update my RSVP</a>
          </p>
    
          <p style="font-size: 16px; text-align: center; color: #777;">
            ${isAttending ? "We are so excited to celebrate with you at the wedding!" : "We're sorry you can’t make it, but we hope to see you soon!"}
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
    return NextResponse.json({ error: "RSVP updated, but email failed" }, { status: 500 });
  }
}