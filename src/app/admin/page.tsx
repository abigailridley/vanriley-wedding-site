"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

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

const AdminPage = () => {
  interface Rsvp {
    id: number;
    name: string;
    email: string;
    rsvp: boolean;
    dessert_choice?: string;
    dessert_topping?: string;
    allergies?: string;
    created_at?: string;
  }

  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRsvps = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("rsvps")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching RSVPs:", error.message);
      } else {
        setRsvps(data);
      }
      setLoading(false);
    };
    fetchRsvps();
  }, []);

  const exportToExcel = () => {
    const exportData = rsvps.map((rsvp) => ({
      "Created At": rsvp.created_at
        ? new Date(rsvp.created_at).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
      Name: rsvp.name,
      RSVP: rsvp.rsvp ? "Yes" : "No",
      Email: rsvp.email,
      "Dessert Choice": rsvp.dessert_choice
        ? dessertChoiceMap[rsvp.dessert_choice] || rsvp.dessert_choice
        : "",
      Topping: rsvp.dessert_topping
        ? dessertToppingMap[rsvp.dessert_topping] || rsvp.dessert_topping
        : "",
      Allergies: rsvp.allergies || "",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "RSVPs");
    XLSX.writeFile(wb, "RSVPs.xlsx");
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-serif text-dark-grey  mb-2">
          Admin Dashboard
        </h1>
      </header>

      <div className="flex justify-center sm:justify-end">
        <button
          onClick={exportToExcel}
          className="bg-orange text-white  hover:bg-orange hover:cursor-pointer hover:opacity-85 transition-colors font-medium py-2 px-6 rounded-md shadow"
        >
          Export to Excel
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Loading RSVPs...
        </p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
          <table className="w-full table-auto text-sm text-left text-gray-700">
            <thead className="bg-hunter text-dark-grey uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3">Created At</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">RSVP</th>
                <th className="px-4 py-3">Dessert Choice</th>
                <th className="px-4 py-3">Topping</th>
                <th className="px-4 py-3">Allergies/Dietary</th>
              </tr>
            </thead>
            <tbody>
              {rsvps.map((rsvp) => (
                <tr
                  key={rsvp.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    {rsvp.created_at
                      ? new Date(rsvp.created_at).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </td>
                  <td className="px-4 py-3">{rsvp.name}</td>
                  <td className="px-4 py-3">{rsvp.email}</td>
                  <td className="px-4 py-3">{rsvp.rsvp ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">
                    {rsvp.dessert_choice
                      ? dessertChoiceMap[rsvp.dessert_choice] ||
                        rsvp.dessert_choice
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {rsvp.dessert_topping
                      ? dessertToppingMap[rsvp.dessert_topping] ||
                        rsvp.dessert_topping
                      : "—"}
                  </td>
                  <td className="px-4 py-3">{rsvp.allergies || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
