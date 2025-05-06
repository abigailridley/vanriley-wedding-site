"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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

  useEffect(() => {
    const fetchRsvpData = async () => {
      if (uuid) {
        const res = await fetch(`/api/update-rsvp?uuid=${uuid}`);
        const json = await res.json();
        if (json.data) {
          const normalisedData: RsvpData = {
            ...json.data,
            dessert_choice: (() => {
              switch (json.data.dessert_choice) {
                case "Chocolate Biscoff Cake":
                  return "chocolate_biscoff";
                case "Lemon Cake":
                  return "lemon";
                case "Fruit Cake":
                  return "fruit";
                default:
                  return "";
              }
            })(),
            dessert_topping: (() => {
              switch (json.data.dessert_topping) {
                case "Cream":
                  return "cream";
                case "Berries":
                  return "berries";
                case "Berries and Cream":
                  return "berries_cream";
                case "None":
                  return "none";
                default:
                  return "";
              }
            })(),
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

      const res = await fetch(`/api/update-rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updatedRsvp,
          dessert_choice:
            dessertChoiceMap[updatedRsvp.dessert_choice || ""] || "",
          dessert_topping:
            dessertToppingMap[updatedRsvp.dessert_topping || ""] || "",
          id: uuid,
        }),
      });

      if (res.ok) {
        router.push("/success");
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

  if (!updatedRsvp) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Update Your RSVP</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault(); // disable accidental enter submission
          }
        }}
        className="space-y-6"
      >
        {/* Name (readonly) */}
        <div>
          <p className="text-sm text-gray-700">
            Guest Name: <span className="italic">{updatedRsvp.name}</span>
          </p>
        </div>

        {/* RSVP */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Will you be joining us?
          </label>
          <Select
            value={updatedRsvp.rsvp ? "yes" : "no"}
            onValueChange={handleRsvpChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select RSVP" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes, I’ll be there 🧡</SelectItem>
              <SelectItem value="no">Sorry, I can’t attend</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dessert + Topping + Allergies */}
        {updatedRsvp.rsvp && (
          <>
            {/* Dessert */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Choose your dessert
              </label>
              <div className={dessertError ? "border-red-500" : ""}>
                <Select
                  value={updatedRsvp.dessert_choice || ""}
                  onValueChange={(val) => handleChange("dessert_choice", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a dessert" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chocolate_biscoff">
                      Chocolate Biscoff Cake
                    </SelectItem>
                    <SelectItem value="lemon">Lemon Cake</SelectItem>
                    <SelectItem value="fruit">Fruit Cake</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {dessertError && (
                <p className="text-red-500 text-sm mt-1">
                  Please select a dessert.
                </p>
              )}
            </div>

            {/* Topping */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Now, choose a dessert topping
              </label>
              <Select
                value={updatedRsvp.dessert_topping || ""}
                onValueChange={(val) => handleChange("dessert_topping", val)}
              >
                <SelectTrigger className={toppingError ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a topping" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cream">Just cream</SelectItem>
                  <SelectItem value="berries">Just berries</SelectItem>
                  <SelectItem value="berries_cream">Berries & Cream</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
              {toppingError && (
                <p className="text-red-500 text-sm mt-1">
                  Please select a topping.
                </p>
              )}
            </div>

            {/* Allergies */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Dietary requirements & Allergies (optional)
              </label>
              <Textarea
                name="allergies"
                value={updatedRsvp.allergies || ""}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}

        {/* Submit button */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Updating..." : "Update RSVP"}
        </Button>

        {/* Error message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
};

const UpdateRsvpPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <UpdateRsvp />
  </Suspense>
);

export default UpdateRsvpPage;
