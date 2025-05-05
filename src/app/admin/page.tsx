"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const AdminPage = () => {
  interface Rsvp {
    id: number;
    name: string;
    email: string;
    rsvp: boolean;
    dessert_choice?: string;
    dessert_topping?: string;
    allergies?: string;
  }

  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch RSVPs from Supabase
  useEffect(() => {
    const fetchRsvps = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("rsvps").select("*");
      if (error) {
        console.error("Error fetching RSVPs:", error.message);
      } else {
        setRsvps(data);
      }
      setLoading(false);
    };
    fetchRsvps();
  }, []);

  // Export RSVPs to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(rsvps);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "RSVPs");
    XLSX.writeFile(wb, "RSVPs.xlsx");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <button
        onClick={exportToExcel}
        className="bg-blue-600 text-white py-2 px-4 rounded-md"
      >
        Export to Excel
      </button>

      {loading ? (
        <p>Loading RSVPs...</p>
      ) : (
        <table className="w-full table-auto mt-4 border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">RSVP</th>
              <th className="border px-4 py-2">Dessert Choice</th>
              <th className="border px-4 py-2">Topping</th>
              <th className="border px-4 py-2">Allergies/Dietary</th>
            </tr>
          </thead>
          <tbody>
            {rsvps.map((rsvp) => (
              <tr key={rsvp.id}>
                <td className="border px-4 py-2">{rsvp.name}</td>
                <td className="border px-4 py-2">{rsvp.email}</td>
                <td className="border px-4 py-2">{rsvp.rsvp ? "Yes" : "No"}</td>
                <td className="border px-4 py-2">
                  {rsvp.dessert_choice || "—"}
                </td>
                <td className="border px-4 py-2">
                  {rsvp.dessert_topping || "—"}
                </td>
                <td className="border px-4 py-2">{rsvp.allergies || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage;
