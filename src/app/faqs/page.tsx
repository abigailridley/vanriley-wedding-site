"use client";

export default function FAQsPage() {
  const questions = [
    {
      title: "When is the wedding?",
      answer: (
        <div>
          <strong>Saturday 23rd May 2026</strong> in beautiful Suffolk.
          <div className="mt-2">
            Day guests are warmly invited to arrive from <strong>1pm</strong>,
            with the ceremony beginning promptly at <strong>2pm</strong>.
            <br />
            Evening guests are welcome to join the celebrations from{" "}
            <strong>7pm</strong> onwards.
          </div>
        </div>
      ),
    },
    {
      title: "Where is the ceremony?",
      answer: (
        <>
          <strong>Alpheton Hall</strong>
          <br />
          Church Lane, Alpheton, Sudbury, Suffolk CO10 9BL
          <div>
            <a
              href="https://alpheton-hall-barns.co.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline italic text-green hover:text-[#2a2a2a]"
            >
              www.alpheton-hall-barns.co.uk
            </a>
          </div>
          <div className="rounded justify-center flex overflow-hidden shadow-lg border mt-8">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2449.747730540292!2d0.7331821119432542!3d52.12071867184228!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8537210914327%3A0xfeb038023475ff50!2sAlpheton%20Hall%20Barns!5e0!3m2!1sen!2suk!4v1747563895841!5m2!1sen!2suk"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <p className="mt-4">
            Coaches will be arranged at midnight to take guests back to The Swan
            Hotel and Sudbury town centre — we&apos;ll confirm nearer the time
            for numbers.
          </p>
        </>
      ),
    },
    {
      title: "What is the dress code?",
      answer: (
        <>
          <p>
            We’d love everyone to dress up — smart suits and dresses are
            perfect.
          </p>
          <p className="mt-2">
            We kindly ask that you avoid wearing these colours, as they’re the
            bridesmaids’ dresses:
          </p>
          <img
            src="images/102934.png"
            alt="Bridesmaid dress colour gradient"
            className="w-1/2 mt-4 rounded shadow justify-center flex mx-auto"
          />
        </>
      ),
    },
    {
      title: "What happens after the ceremony?",
      answer:
        "Join us for the wedding breakfast, followed by an evening of music, drinks, and celebrations.",
    },
    {
      title: "Where should we stay?",
      answer: (
        <>
          <p>
            A block of rooms has been reserved at{" "}
            <strong>The Swan Hotel & Spa</strong> in Lavenham for Saturday 23rd
            May. Rooms are first-come, first-served — please book by{" "}
            <strong>14th September</strong> and reference “
            <strong>Riley</strong>” when reserving.
          </p>
          <p>
            <strong>
              To book please email{" "}
              <a
                href="mailto:functions@theswanatlavenham.co.uk"
                className="underline text-[#4b6c52] hover:text-[#2a2a2a]"
              >
                functions@theswanatlavenham.co.uk
              </a>
            </strong>
          </p>
          <div className="mt-2 text-base space-y-1">
            <p>
              <strong>Address:</strong> High St, Lavenham, Sudbury CO10 9QA
            </p>
            <p>
              <strong>Phone:</strong> <span>01787 247477</span> and select
              extension 3 for events
            </p>
            <p>
              <strong>Website:</strong>{" "}
              <a
                href="https://theswanatlavenham.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#4b6c52]"
              >
                theswanatlavenham.co.uk
              </a>
            </p>
          </div>
          <p className="mt-2">
            The nearest larger town is Sudbury, where you&apos;ll find plenty of
            alternative hotels and guest rooms.
          </p>
        </>
      ),
    },
    {
      title: "Who is invited?",
      answer:
        "We're so looking forward to celebrating with you! Please note that the invitation is only for the people named on your invite — we are keeping things small and intimate, so we kindly ask that you don’t bring additional guests or children. Thank you for understanding.",
    },
    {
      title: "Do you have a gift list?",
      answer: (
        <>
          <p>
            Your presence is genuinely the only gift we want. We know weddings
            come with their own costs, especially with accommodation — and
            simply booking a room to join us is more than enough.
          </p>
          <p className="mt-2">
            If you really feel you’d like to contribute something, a small
            donation towards our honeymoon fund would be perfect.
          </p>
        </>
      ),
    },
    {
      title: "When should we RSVP?",
      answer: (
        <>
          Please RSVP by <strong>1st November 2025</strong> via our website:{" "}
          <a
            href="https://vanrileywedding.co.uk/rsvp"
            className="underline text-[#4b6c52] hover:text-[#2a2a2a]"
          >
            vanrileywedding.co.uk
          </a>
        </>
      ),
    },
    {
      title: "Still have questions?",
      answer: (
        <>
          Reach out any time at{" "}
          <a
            href="mailto:contact@vanrileywedding.co.uk"
            className="underline text-[#4b6c52] hover:text-[#2a2a2a]"
          >
            contact@vanrileywedding.co.uk
          </a>{" "}
          — we’re more than happy to help.
        </>
      ),
    },
  ];

  return (
    <div className="bg-green min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12 text-[#2a2a2a] font-playfair space-y-10">
        <section className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
            FAQs
          </h1>
        </section>

        <section className="space-y-6">
          {questions.map((question, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm px-6 py-6"
            >
              <h2 className="text-xl font-semibold text-[#4b6c52] border-b border-[#e6daca] pb-1 mb-4">
                {question.title}
              </h2>
              <div className="text-lg space-y-2">{question.answer}</div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
