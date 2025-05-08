import Link from "next/link";

export default function Home() {
  return (
    <div className="container  mx-auto py-12">
      <h1 className="text-4xl font-bodoni">Welcome to Our Wedding!</h1>
      <Link href="/rsvp">
        <button className=" font-dancing">RSVP</button>
      </Link>
    </div>
  );
}
