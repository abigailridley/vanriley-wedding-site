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

const UpdateRsvp = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const uuid = searchParams?.get("uuid");

  const [updatedRsvp, setUpdatedRsvp] = useState<RsvpData | null>(null);

  useEffect(() => {
    const fetchRsvpData = async () => {
      if (uuid) {
        const res = await fetch(`/api/update-rsvp?uuid=${uuid}`);
        const json = await res.json();
        if (json.data) {
          setUpdatedRsvp(json.data);
        } else {
          console.error("Failed to load RSVP data", json.error);
        }
      }
    };
    fetchRsvpData();
  }, [uuid]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatedRsvp) return;

    const res = await fetch(`/api/update-rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedRsvp),
    });

    const { error } = await res.json();
    if (error) {
      console.error("Error updating RSVP:", error);
    } else {
      router.push("/success?type=update");
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

      <form onSubmit={handleUpdate} className="space-y-6">
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
              <Select
                value={updatedRsvp.dessert_choice || ""}
                onValueChange={(val) => handleChange("dessert_choice", val)}
              >
                <SelectTrigger>
                  <SelectValue>
                    {updatedRsvp.dessert_choice || "Select a dessert"}
                  </SelectValue>
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

            {/* Topping */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Now, choose a dessert topping
              </label>
              <Select
                value={updatedRsvp.dessert_topping || ""}
                onValueChange={(val) => handleChange("dessert_topping", val)}
              >
                <SelectTrigger>
                  <SelectValue>
                    {updatedRsvp.dessert_topping || "Select a topping"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cream">Just cream</SelectItem>
                  <SelectItem value="berries">Just berries</SelectItem>
                  <SelectItem value="berries_cream">Berries & Cream</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
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

        <Button type="submit" className="w-full">
          Update RSVP
        </Button>
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
