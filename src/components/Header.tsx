import Link from "next/link";

const Header = () => {
  return (
    <header className="py-3 bg-tan shadow-md text-dark-grey">
      <nav className="container mx-auto flex justify-between ">
        {/* Left column: links */}
        <div className="w-24 space-x-1 font-playfair text-lg tracking-widest">
          <Link href="/" className="hover:underline">
            home
          </Link>
          <span>|</span>
          <Link href="/accom" className="hover:underline">
            accommodation
          </Link>
          <span>|</span>
          <Link href="/rsvp" className="hover:underline">
            RSVP
          </Link>
        </div>

        <div className="font-playfair text-2xl tracking-tighter flex-grow text-center">
          GEMMA & ALI
        </div>

        {/* Right column: empty for now */}
        <div className="w-24" />
      </nav>
    </header>
  );
};

export default Header;
