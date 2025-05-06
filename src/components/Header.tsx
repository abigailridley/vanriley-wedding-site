// components/header.tsx
import Link from "next/link";

const Header = () => {
  return (
    <header className="py-4 bg-gray-100 shadow-md">
      <nav className="max-w-6xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-lg font-semibold text-gray-700 hover:text-gray-900"
        >
          Home
        </Link>
        <div className="space-x-4">
          <Link
            href="/accom"
            className="text-lg font-semibold text-gray-700 hover:text-gray-900"
          >
            Accommodation
          </Link>
          <Link
            href="/rsvp"
            className="text-lg font-semibold text-gray-700 hover:text-gray-900"
          >
            RSVP
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
