import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <div className="flex justify-center items-center min-h-screen bg-orange p-6">
        <div className="relative w-[90vw] max-w-md aspect-square rounded-xl overflow-hidden">
          <Image
            src="/images/main.jpg"
            alt="Gemma & Ali"
            fill
            className="object-cover grayscale brightness-90"
            priority
          />

          {/* Overlay text in bottom right */}
          <div className="absolute bottom-4 right-4 text-right font-bodoni text-4xl md:text-5xl tracking-tight leading-none text-white shadow-xl">
            <div className="font-dancing">we're</div>
            <div>getting</div>
            <div>married</div>
          </div>
        </div>
      </div>

      {/* Info Sections */}
      <section className="bg-white text-dark-grey px-[20vw] py-12 space-y-20">
        {/* Row 1: Image left, text right */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
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
            <p className="text-center md:text-left">23 May 2025 · Time TBC</p>
          </div>
        </div>

        {/* Row 2: Text left, image right */}
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
