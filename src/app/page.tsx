import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-semibold">Welcome to Our Wedding!</h1>
      <Link href="/rsvp">
        <Button>RSVP</Button>
      </Link>
    </div>
  );
}
