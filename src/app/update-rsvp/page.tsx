"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type RsvpData = {
  uuid: string;
  name: string;
  email: string;
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
    <section className="bg-green text-dark-grey px-[10vw] py-12">
      <form
        onSubmit={handleUpdate}
        className="space-y-8 max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-3xl font-bodoni text-center text-hunter-green">
          Update RSVP
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
            value={updatedRsvp.name}
            onChange={handleInputChange}
            name="name"
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
            value={updatedRsvp.email}
            onChange={handleInputChange}
            name="email"
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
            value={updatedRsvp.rsvp ? "yes" : "no"}
            onChange={(e) => handleRsvpChange(e.target.value)}
            className="mt-1 p-4 border border-gray-300 rounded-md w-full text-dark-grey focus:outline-none focus:ring-2 focus:ring-hunter-green"
          >
            <option value="yes">Yes, I&apos;ll be there ♡</option>
            <option value="no">Sorry, I cannot attend</option>
          </select>
        </div>

        {updatedRsvp.rsvp && (
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
                value={updatedRsvp.dessert_choice}
                onChange={(e) => handleChange("dessert_choice", e.target.value)}
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
                <p className="text-red-500 text-sm mt-2">
                  Please select a dessert.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="topping"
                className="block text-lg font-bodoni text-hunter-green"
              >
                Choose your topping
              </label>
              <select
                id="topping"
                value={updatedRsvp.dessert_topping}
                onChange={(e) =>
                  handleChange("dessert_topping", e.target.value)
                }
                className={`mt-1 p-4 border ${toppingError ? "border-red-500" : "border-gray-300"} rounded-md w-full text-dark-grey focus:outline-none focus:ring-2 focus:ring-hunter-green`}
              >
                <option value="">Select a topping</option>
                <option value="cream">Cream</option>
                <option value="berries">Berries</option>
                <option value="berries_cream">Berries & Cream</option>
                <option value="none">None</option>
              </select>
              {toppingError && (
                <p className="text-red-500 text-sm mt-2">
                  Please select a topping.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="allergies"
                className="block text-lg font-bodoni text-hunter-green"
              >
                Allergies or dietary requirements
              </label>
              <textarea
                id="allergies"
                value={updatedRsvp.allergies || ""}
                onChange={handleInputChange}
                name="allergies"
                rows={4}
                className="mt-1 p-4 border border-gray-300 rounded-md w-full text-dark-grey focus:outline-none focus:ring-2 focus:ring-hunter-green"
              />
            </div>
          </>
        )}

        <div className="mt-6 text-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-orange-700 text-white text-lg font-bold rounded-lg hover:bg-orange-600 transition"
          >
            {loading ? (
              <span className="animate-spin">Submitting...</span>
            ) : (
              "Update RSVP"
            )}
          </button>
        </div>

        {error && <p className="text-center text-red-500">{error}</p>}
      </form>
    </section>
  );
};

export default UpdateRsvp;
