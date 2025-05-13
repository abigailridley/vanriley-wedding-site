"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

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
        {/* Form content */}
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
