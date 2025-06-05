import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Add your mappings here
const dessertChoiceMap: Record<string, string> = {
  chocolate_biscoff: "Chocolate Biscoff Cake",
  lemon: "Lemon & Elderflower Cake",
  fruit: "Fruit Cake",
};

const dessertToppingMap: Record<string, string> = {
  cream: "Cream",
  berries: "Berries",
  berries_cream: "Berries and Cream",
  none: "None",
};

export async function POST(req: Request) {
  const body = await req.json();

  const isAttending = body.rsvp === true;

  // Format dessert and topping for emails
  const formattedDessert = isAttending ? dessertChoiceMap[body.dessert_choice] || "N/A" : null;
  const formattedTopping = isAttending ? dessertToppingMap[body.dessert_topping] || "None" : null;

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

  // 2. Send admin email
  try {
    await resend.emails.send({
      from: "Van-Riley Wedding RSVP <rsvp@vanrileywedding.co.uk>",
      to: "hello@vanrileywedding.co.uk",
      subject: "New RSVP Submission",
      html: `
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Attending:</strong> ${isAttending ? "Yes" : "No"}</p>
        ${isAttending ? `
          <p><strong>Dessert:</strong> ${formattedDessert}</p>
          <p><strong>Topping:</strong> ${formattedTopping}</p>
          <p><strong>Allergies:</strong> ${body.allergies || "None"}</p>
        ` : ""}
       
      `,
    });

    // 3. Send guest confirmation email
    await resend.emails.send({
      from: "Gemma & Ali's Wedding RSVP <rsvp@vanrileywedding.co.uk>",
      to: body.email,
      subject: "Thanks for your RSVP!",
      html: `
        <div style="font-family: 'Georgia', serif; color: #333333; line-height: 1.8; padding: 30px; background-color: #fafafa; border-radius: 10px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0;">
          <h2 style="color: #b94e4d; text-align: center; font-size: 24px;">Thank you for your RSVP, ${body.name}!</h2>

          ${
            isAttending
              ? `
            <p style="font-size: 18px; text-align: center;">We’re so happy you’ll be joining us!</p>
            <hr />
            <p><strong>Attending:</strong> ${isAttending ? "Yes" : "No"}</p>
            <p><strong>Your Dessert:</strong> ${formattedDessert}</p>
            <p><strong>Topping:</strong> ${formattedTopping}</p>
            <p><strong>Allergies:</strong> ${body.allergies || "None"}</p>
            <p>You can update your RSVP any time using this link:</p>
             <p style="text-align: center;">
            <a href="${updateLink}" style="background-color: #d86c2b; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Update my RSVP</a>
          </p>
          `
              : `
            <p style="font-size: 18px; text-align: center;">We’re sorry you can’t join us — but thank you for letting us know.</p>
            <p>If your plans change, you can update your RSVP here:</p>
             <p style="text-align: center;">
            <a href="${updateLink}" style="background-color: #d86c2b; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Update my RSVP</a>
          </p>
          `
          }
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error sending email:", err);
    return NextResponse.json({ error: "Failed to send emails" }, { status: 500 });
  }
}