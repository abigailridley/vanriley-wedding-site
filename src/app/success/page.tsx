"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const Success = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams?.get("type");
  const rsvp = searchParams?.get("rsvp");

  return (
    <div className="min-h-screen bg-tan flex items-center justify-center px-4 py-16">
      <div className="bg-white max-w-2xl w-full text-center p-10 rounded-lg shadow-lg border border-green">
        <h1 className="text-3xl sm:text-4xl font-bodoni text-hunter-green mb-6">
          {type === "update"
            ? "Thank you for updating your RSVP to the Van-Riley wedding!"
            : "Thank you for submitting your RSVP to the Van-Riley wedding!"}
        </h1>

        <p className="text-lg font-playfair text-dark-grey mb-4">
          {type === "update"
            ? "You will receive an email confirming your changes."
            : rsvp === "no"
              ? "We're sorry you can't make it — thank you for letting us know."
              : "We can't wait to see you at the wedding!"}
        </p>

        <p className="text-lg font-playfair text-dark-grey mb-8">
          {type === "update"
            ? "If you need to make any further changes, you will receive an email with a link to update your details."
            : "If you need to make any changes, you will receive an email with a link to update your details."}
        </p>

        <button
          onClick={() => router.push("/")}
          className="bg-orange text-white font-bodoni text-lg px-6 py-2 rounded-md hover:bg-burnt-orange/90 focus:outline-none focus:ring-2 focus:ring-hunter-green transition"
        >
          Return to Homepage
        </button>
      </div>
    </div>
  );
};

const SuccessPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Success />
  </Suspense>
);

export default SuccessPage;
