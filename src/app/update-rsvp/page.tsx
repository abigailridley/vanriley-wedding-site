"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type RsvpData = {
  uuid: string;
  name: string;
  rsvp: boolean;
  allergies?: string;
  dessert_choice?: string;
  dessert_topping?: string;
};

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

const UpdateRsvp = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const uuid = searchParams?.get("uuid");

  const [updatedRsvp, setUpdatedRsvp] = useState<RsvpData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dessertError, setDessertError] = useState(false);
  const [toppingError, setToppingError] = useState(false);

  const toSentenceCase = (str: string) => {
    return str
      .toLowerCase()
      .replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
  };

  useEffect(() => {
    const fetchRsvpData = async () => {
      if (uuid) {
        const res = await fetch(`/api/update-rsvp?uuid=${uuid}`);
        const json = await res.json();
        if (json.data) {
          const normalisedData: RsvpData = {
            ...json.data,
            dessert_choice:
              Object.entries(dessertChoiceMap).find(
                ([, label]) => label === json.data.dessert_choice
              )?.[0] || "",
            dessert_topping:
              Object.entries(dessertToppingMap).find(
                ([, label]) => label === json.data.dessert_topping
              )?.[0] || "",
          };
          setUpdatedRsvp(normalisedData);
        } else {
          console.error("Failed to load RSVP data", json.error);
        }
      }
    };
    fetchRsvpData();
  }, [uuid]);

  const handleUpdate = async () => {
    setLoading(true);
    setError("");

    if (!updatedRsvp) {
      setError("Missing guest ID.");
      setLoading(false);
      return;
    }

    if (
      updatedRsvp.rsvp &&
      (!updatedRsvp.dessert_choice || !updatedRsvp.dessert_topping)
    ) {
      setDessertError(!updatedRsvp.dessert_choice);
      setToppingError(!updatedRsvp.dessert_topping);
      setLoading(false);
      return;
    }

    try {
      const confirmed = window.confirm(
        "Does everything look right? We can't wait to celebrate with you."
      );
      if (!confirmed) {
        setLoading(false);
        return;
      }

      const formattedAllergies = updatedRsvp.allergies
        ? toSentenceCase(updatedRsvp.allergies)
        : "";

      const res = await fetch(`/api/update-rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updatedRsvp,
          allergies: formattedAllergies,
          dessert_choice:
            dessertChoiceMap[updatedRsvp.dessert_choice || ""] || "",
          dessert_topping:
            dessertToppingMap[updatedRsvp.dessert_topping || ""] || "",
          id: uuid,
        }),
      });

      if (res.ok) {
        router.push("/success?type=update");
      } else {
        setError("Failed to update RSVP.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (updatedRsvp) {
      setUpdatedRsvp({ ...updatedRsvp, [name]: value });
    }
  };

  const handleChange = (key: keyof RsvpData, value: string) => {
    setUpdatedRsvp((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  const handleRsvpChange = (value: string) => {
    const attending = value === "yes";
    setUpdatedRsvp((prev) =>
      prev
        ? {
            ...prev,
            rsvp: attending,
            ...(attending
              ? {}
              : {
                  dessert_choice: "",
                  dessert_topping: "",
                  allergies: "",
                }),
          }
        : null
    );
  };

  if (!updatedRsvp)
    return (
      <div className="max-w-xl mx-auto px-4 py-10 font-playfair text-center text-lg">
        <p>We&apos;re sorry, we can’t find your RSVP details!</p>
        <p className="mt-4">
          Please contact us at{" "}
          <a
            href="mailto:hello@vanrileywedding.co.uk"
            className="text-orange-700 underline"
          >
            hello@vanrileywedding.co.uk
          </a>{" "}
          and we’ll help you update your choices.
        </p>
      </div>
    );

  return (
    <div className="max-w-xl mx-auto px-4 py-10 font-playfair">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Update Your RSVP
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        className="space-y-6"
      >
        <p className="text-base text-gray-700">
          Guest Name: <span className="italic">{updatedRsvp.name}</span>
        </p>

        {/* RSVP */}
        <div>
          <label className="block text-base mb-1">
            Will you be joining us?
          </label>
          <select
            className="w-full border border-gray-300 rounded-md p-2 bg-white"
            value={updatedRsvp.rsvp ? "yes" : "no"}
            onChange={(e) => handleRsvpChange(e.target.value)}
          >
            <option value="yes">Yes, I’ll be there 🧡</option>
            <option value="no">Sorry, I can’t attend</option>
          </select>
        </div>

        {updatedRsvp.rsvp && (
          <>
            {/* Dessert */}
            <div>
              <label className="block text-base mb-1">
                Choose your dessert
              </label>
              <select
                className={`w-full border rounded-md p-2 bg-white ${
                  dessertError ? "border-red-500" : "border-gray-300"
                }`}
                value={updatedRsvp.dessert_choice || ""}
                onChange={(e) => handleChange("dessert_choice", e.target.value)}
              >
                <option value="">Select a dessert</option>
                <option value="chocolate_biscoff">
                  Chocolate Biscoff Cake
                </option>
                <option value="lemon">Lemon Cake</option>
                <option value="fruit">Fruit Cake</option>
              </select>
              {dessertError && (
                <p className="text-red-600 text-sm mt-1">
                  Please select a dessert.
                </p>
              )}
            </div>

            {/* Topping */}
            <div>
              <label className="block text-base mb-1">
                Now, choose a dessert topping
              </label>
              <select
                className={`w-full border rounded-md p-2 bg-white ${
                  toppingError ? "border-red-500" : "border-gray-300"
                }`}
                value={updatedRsvp.dessert_topping || ""}
                onChange={(e) =>
                  handleChange("dessert_topping", e.target.value)
                }
              >
                <option value="">Select a topping</option>
                <option value="cream">Just cream</option>
                <option value="berries">Just berries</option>
                <option value="berries_cream">Berries & Cream</option>
                <option value="none">None</option>
              </select>
              {toppingError && (
                <p className="text-red-600 text-sm mt-1">
                  Please select a topping.
                </p>
              )}
            </div>

            {/* Allergies */}
            <div>
              <label className="block text-base mb-1">
                Dietary requirements & Allergies{" "}
                <span className="text-sm text-gray-500">(optional)</span>
              </label>
              <textarea
                name="allergies"
                className="w-full border border-gray-300 rounded-md p-2"
                value={updatedRsvp.allergies || ""}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-700 text-white py-2 px-4 rounded-md hover:bg-orange-800 transition-colors disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update RSVP"}
        </button>

        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  );
};

const UpdateRsvpPage = () => (
  <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
    <UpdateRsvp />
  </Suspense>
);

export default UpdateRsvpPage;
