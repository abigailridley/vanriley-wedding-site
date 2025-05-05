"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RSVPForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [allergies, setAllergies] = useState("");
  const [dessertChoice, setDessertChoice] = useState("");
  const [dessertTopping, setDessertTopping] = useState("");
  const [rsvp, setRsvp] = useState(true); // Default to attending
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formatDessertChoice = (choice: string) => {
      switch (choice) {
        case "chocolate_biscoff":
          return "Chocolate Biscoff Cake";
        case "lemon":
          return "Lemon Cake";
        case "fruit":
          return "Fruit Cake";
        default:
          return null;
      }
    };

    const formatDessertTopping = (topping: string) => {
      switch (topping) {
        case "cream":
          return "Cream";
        case "berries":
          return "Berries";
        case "berries_cream":
          return "Berries and Cream";
        case "none":
          return "None";
        default:
          return null;
      }
    };

    const formattedEmail = email.trim().toLowerCase();
    const formattedName = name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
    const formattedAllergies = allergies.trim() || null;

    const formattedDessert = formatDessertChoice(dessertChoice);
    const formattedTopping = formatDessertTopping(dessertTopping);

    try {
      const response = await fetch("/api/submit-rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formattedName,
          email: formattedEmail,
          rsvp,
          dessert_choice: formattedDessert,
          dessert_topping: formattedTopping,
          allergies: formattedAllergies,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit RSVP.");
      }

      setName("");
      setEmail("");
      setRsvp(true);
      setAllergies("");
      setDessertChoice("");
      setDessertTopping("");

      router.push("/success?type=submission");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <Label htmlFor="name">Guest Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* RSVP */}
        <div>
          <Label htmlFor="rsvp">Will you be joining us?</Label>
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
              }
            }}
            className="mt-1 p-3 border border-gray-300 rounded-md"
          >
            <option value="yes">Yes, I&apos;ll be there 🧡</option>
            <option value="no">Sorry, I cannot attend</option>
          </select>
        </div>

        {/* Dessert and Allergies (only if attending) */}
        {rsvp && (
          <>
            {/* Dessert Choice */}
            <div>
              <Label htmlFor="dessert">Choose your dessert</Label>
              <Select value={dessertChoice} onValueChange={setDessertChoice}>
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

            {/* Dessert Topping */}
            <div>
              <Label htmlFor="topping">Now, choose a dessert topping</Label>
              <Select value={dessertTopping} onValueChange={setDessertTopping}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a topping" />
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
              <Label htmlFor="allergies">
                Dietary requirements & Allergies (Optional)
              </Label>
              <Textarea
                id="allergies"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
              />
            </div>
          </>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit RSVP"}
          </Button>
        </div>

        {/* Error */}
        {error && <p className="text-red-500">{error}</p>}
      </form>
    );
  };
};

export default RSVPForm;
