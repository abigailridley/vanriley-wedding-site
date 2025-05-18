"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Human-readable labels for email formatting
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

const RSVPForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [allergies, setAllergies] = useState("");
  const [dessertChoice, setDessertChoice] = useState("");
  const [dessertTopping, setDessertTopping] = useState("");
  const [rsvp, setRsvp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dessertError, setDessertError] = useState(false);
  const [toppingError, setToppingError] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const needsDessert = rsvp && !dessertChoice;
    const needsTopping = rsvp && !dessertTopping;
    if (needsDessert || needsTopping) {
      setDessertError(needsDessert);
      setToppingError(needsTopping);
      setLoading(false);
      return;
    } else {
      setDessertError(false);
      setToppingError(false);
    }

    const confirmed = window.confirm(
      "All set? Double-check your info before we save your RSVP."
    );
    if (!confirmed) {
      setLoading(false);
      return;
    }

    const formattedEmail = email.trim().toLowerCase();
    const formattedName = name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
    const formattedAllergies =
      allergies
        .trim()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (match) => match.toUpperCase()) ||
      null;

    try {
      const response = await fetch("/api/submit-rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formattedName,
          email: formattedEmail,
          rsvp,
          dessert_choice: dessertChoice, // database: raw value
          dessert_topping: dessertTopping, // database: raw value
          allergies: formattedAllergies,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit RSVP.");

      await fetch("/api/send-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formattedName,
          email: formattedEmail,
          rsvp,
          dessert: rsvp ? dessertChoiceMap[dessertChoice] : null,
          topping: rsvp ? dessertToppingMap[dessertTopping] : null,
          allergies: formattedAllergies,
        }),
      });

      setName("");
      setEmail("");
      setRsvp(true);
      setAllergies("");
      setDessertChoice("");
      setDessertTopping("");

      router.push("/success?type=submission");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-green text-dark-grey px-[10vw] py-12">
      <div className="max-w-3xl mx-auto mb-8 italic text-center text-md sm:text-lg font-playfair tracking-wide text-dark-grey bg-orange p-6 rounded-lg shadow-sm">
        <p>
          We kindly ask that only those named on the invitation complete this
          RSVP form.
        </p>
        <hr className="my-4 w-2/3 mx-auto border-dark-grey opacity-50 " />
        <p>
          If you&apos;re replying on behalf of another guest, please submit a
          separate RSVP for each person. You may use the same email address —
          each guest will receive their own confirmation.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-3xl font-bodoni text-center text-hunter-green">
          RSVP
        </h2>

        <div>
          <label
            htmlFor="name"
            className="block text-lg font-playfair text-hunter-green"
          >
            Guest Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 p-4 border border-gray-300 rounded-md w-full text-dark-grey focus:outline-none focus:ring-2 focus:ring-hunter-green"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-lg font-bodoni text-hunter-green"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 p-4 border border-gray-300 rounded-md w-full text-dark-grey focus:outline-none focus:ring-2 focus:ring-hunter-green"
          />
        </div>

        <div>
          <label
            htmlFor="rsvp"
            className="block text-lg font-bodoni text-hunter-green"
          >
            Will you be joining us?
          </label>
          <select
            id="rsvp"
            value={rsvp ? "yes" : "no"}
            onChange={(e) => {
              const attending = e.target.value === "yes";
              setRsvp(attending);
              if (!attending) {
                setDessertChoice("");
                setDessertTopping("");
                setAllergies("");
                setDessertError(false);
                setToppingError(false);
              }
            }}
            className="mt-1 p-4 border border-gray-300 rounded-md w-full text-dark-grey focus:outline-none focus:ring-2 focus:ring-hunter-green"
          >
            <option value="yes">Yes, I&apos;ll be there ♡</option>
            <option value="no">Sorry, I cannot attend</option>
          </select>
        </div>

        {rsvp && (
          <>
            <div>
              <label
                htmlFor="dessert"
                className="block text-lg font-bodoni text-hunter-green"
              >
                Choose your dessert
              </label>
              <select
                id="dessert"
                value={dessertChoice}
                onChange={(e) => setDessertChoice(e.target.value)}
                className={`mt-1 p-4 border ${dessertError ? "border-red-500" : "border-gray-300"} rounded-md w-full text-dark-grey focus:outline-none focus:ring-2 focus:ring-hunter-green`}
              >
                <option value="">Select a dessert</option>
                <option value="chocolate_biscoff">
                  Chocolate Biscoff Cake
                </option>
                <option value="lemon">Lemon Cake</option>
                <option value="fruit">Fruit Cake</option>
              </select>
              {dessertError && (
                <p className="text-red-500 text-sm mt-1">
                  Please select a dessert.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="topping"
                className="block text-lg font-bodoni text-hunter-green"
              >
                Choose a dessert topping
              </label>
              <select
                id="topping"
                value={dessertTopping}
                onChange={(e) => setDessertTopping(e.target.value)}
                className={`mt-1 p-4 border ${toppingError ? "border-red-500" : "border-gray-300"} rounded-md w-full text-dark-grey focus:outline-none focus:ring-2 focus:ring-hunter-green`}
              >
                <option value="">Select a topping</option>
                <option value="cream">Just cream</option>
                <option value="berries">Just berries</option>
                <option value="berries_cream">Berries & Cream</option>
                <option value="none">None</option>
              </select>
              {toppingError && (
                <p className="text-red-500 text-sm mt-1">
                  Please select a topping.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="allergies"
                className="block text-lg font-bodoni text-hunter-green"
              >
                Dietary requirements & Allergies (Optional)
              </label>
              <textarea
                id="allergies"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="mt-1 p-4 border border-gray-300 rounded-md w-full text-dark-grey focus:outline-none focus:ring-2 focus:ring-hunter-green"
              />
            </div>
          </>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-orange text-white py-2 px-6 rounded-md font-bodoni text-lg hover:bg-burnt-orange/90 focus:outline-none focus:ring-2 focus:ring-hunter-green cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting</span>
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </form>
    </section>
  );
};

export default RSVPForm;
