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
            href="mailto:contact@vanrileywedding.co.uk"
            className="text-orange-700 underline"
          >
            contact@vanrileywedding.co.uk
          </a>{" "}
          and we’ll help you update your choices.
        </p>
      </div>
    );

  return (
    <section className="bg-green text-dark-grey px-[10vw] py-12">
      <form
        className="space-y-8 my-10px max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg"
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <h2 className="text-3xl font-bodoni text-center text-hunter-green">
          Update RSVP
        </h2>
        <div>
          <p className="text-base font-playfair text-gray-700">
            Update the RSVP for <strong>{updatedRsvp.name}</strong>
          </p>
        </div>
        <div>
          <label
            htmlFor="rsvp"
            className="block text-lg text-hunter-green mb-1"
          >
            Will you be joining us?
          </label>
          <select
            className="mt-1 p-4 border border-gray-300 rounded-md w-full text-dark-grey focus:outline-none focus:ring-2 focus:ring-hunter-green"
            value={updatedRsvp.rsvp ? "yes" : "no"}
            onChange={(e) => handleRsvpChange(e.target.value)}
          >
            <option value="yes">Yes, I&apos;ll be there ♡</option>
            <option value="no">Sorry, I can&apos;t attend</option>
          </select>
        </div>
        {updatedRsvp.rsvp && (
          <>
            {/* Dessert */}
            <div>
              <label
                htmlFor="dessert"
                className="block text-lg text-hunter-green"
              >
                Choose your dessert
              </label>
              <select
                className={` mt-1 p-4 border ${dessertError ? "border-red-500" : "border-gray-300"} rounded-md w-full text-dark-grey focus:outline-none focus:ring-2 focus:ring-hunter-green`}
                value={updatedRsvp.dessert_choice || ""}
                onChange={(e) => handleChange("dessert_choice", e.target.value)}
              >
                <option value="">Select a dessert</option>
                <option value="chocolate_biscoff">
                  Chocolate Biscoff Cake
                </option>
                <option value="lemon">Lemon & Elderflower Cake</option>
                <option value="fruit">Fruit Cake</option>
              </select>
              {dessertError && (
                <p className="text-red-500 text-sm mt-1">
                  Please select a dessert.
                </p>
              )}
            </div>
            {/* Topping */}

            <div>
              <label
                htmlFor="topping"
                className="block text-lg text-hunter-green"
              >
                Choose a dessert topping
              </label>
              <select
                id="topping"
                className={`mt-1 p-4 border ${toppingError ? "border-red-500" : "border-gray-300"} rounded-md w-full text-dark-grey focus:outline-none focus:ring-2 focus:ring-hunter-green`}
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
              <label htmlFor="allergies" className="block text-base mb-1">
                Dietary requirements & Allergies (Optional)
              </label>
              <textarea
                id="allergies"
                className="mt-1 p-4 border border-gray-300 rounded-md w-full text-dark-grey focus:outline-none focus:ring-2 focus:ring-hunter-green"
                value={updatedRsvp.allergies || ""}
                onChange={handleInputChange}
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
                <span>Updating</span>
              </>
            ) : (
              "Submit"
            )}
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </form>
    </section>
  );
};

const UpdateRsvpPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <UpdateRsvp />
  </Suspense>
);

export default UpdateRsvpPage;
