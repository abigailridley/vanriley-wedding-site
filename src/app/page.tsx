import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <div className="relative pt-10 pb-20 sm:pt-5 sm:pb-15 bg-orange flex justify-center items-center">
        {/* Add horizontal padding wrapper */}
        <div className="px-6 w-full flex justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-xl overflow-hidden">
            <Image
              src="/images/main.jpg"
              alt="Gemma & Ali"
              fill
              className="object-cover grayscale brightness-90"
              priority
            />

            <div className="absolute bottom-4 right-4 text-right font-bodoni text-6xl tracking-tight leading-none text-white shadow-xl">
              <div className="font-dancing">we're</div>
              <div>getting</div>
              <div>married</div>
            </div>
          </div>
        </div>

        {/* Date at bottom right edge of hero */}
        <div className="absolute bottom-0 text-5xl  right-6 md:right-10 text-white font-bodoni tracking-wide">
          23 MAY 2026
        </div>
      </div>

      {/* Info Sections */}
      <section className="bg-white text-dark-grey px-[20vw] py-12 space-y-20">
        {/* Row 1 */}
        <div className="flex flex-col md:flex-row items-center ">
          <div className="relative w-full md:w-1/2 max-w-sm">
            <Image
              src="/images/ring.jpg"
              alt="A special moment"
              width={600}
              height={400}
              className="rounded-xl object-cover grayscale brightness-90 w-full h-auto"
            />
          </div>
          <div className="w-full md:w-1/2 font-playfair text-sm leading-relaxed tracking-wide">
            <p className="text-center md:text-left">23 May 2026 · Time TBC</p>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
          <div className="relative w-full md:w-1/2 max-w-sm">
            <Image
              src="/images/laugh.jpg"
              alt="Venue details"
              width={600}
              height={400}
              className="rounded-xl object-cover grayscale brightness-90 w-full h-auto"
            />
          </div>
          <div className="w-full md:w-1/2 font-playfair text-sm leading-relaxed tracking-wide">
            <p className="text-center md:text-left">More info to come</p>
          </div>
        </div>
      </section>
    </>
  );
}
