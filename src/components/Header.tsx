import Link from "next/link";

const Header = () => {
  return (
    <header className="py-4 bg-tan shadow-md text-dark-grey relative">
      <nav className="container mx-auto flex justify-between items-center relative">
        {/* Left column: links */}
        <div className="hidden md:flex space-x-4 font-playfair text-md tracking-widest">
          <Link href="/" className="hover:underline">
            home
          </Link>
          <span>|</span>
          <Link href="/rsvp" className="hover:underline">
            RSVP
          </Link>
          <span>|</span>
          <Link href="/faqs" className="hover:underline">
            faqs
          </Link>
        </div>

        {/* Centre column: GEMMA & ALI - always centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2 md:static sm:transform-none font-playfair text-2xl tracking-tighter text-center pt-5 sm:pt-0">
          GEMMA & ALI
        </div>

        {/* Right column: empty */}
        <div className="w-24" />
      </nav>

      {/* Links shown below on small screens */}
      <div className="md:hidden flex justify-center space-x-4 mt-4 font-playfair text-md tracking-wide  pt-5 sm:pt-0">
        <Link href="/" className="hover:underline">
          home
        </Link>
        <span>|</span>
        <Link href="/rsvp" className="hover:underline">
          RSVP
        </Link>
        <span>|</span>
        <Link href="/faqs" className="hover:underline">
          faqs
        </Link>
      </div>
    </header>
  );
};

export default Header;
