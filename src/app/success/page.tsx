"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const Success = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams?.get("type"); // Get the 'type' from the URL

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">
          {type === "update"
            ? "Thank you for updating your RSVP to the Van-Riley wedding!"
            : "Thank you for submitting your RSVP to the Van-Riley wedding!"}
        </h1>
        <p>
          {type === "update"
            ? "You will receive an email confirming your changes."
            : "We can&apos;t wait to see you at the wedding!"}
        </p>
        <p>
          {type === "update"
            ? "If you need to make any further changes, you will receive an email with a link to update your details."
            : "If you need to make any changes, you will receive an email with a link to update your details."}
        </p>
        <Button onClick={() => router.push("/")}>Return to Homepage</Button>
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
