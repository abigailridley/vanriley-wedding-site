import Image from "next/image";

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-orange px-4">
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
  );
}
