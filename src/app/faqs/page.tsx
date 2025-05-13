"use client";

export default function FAQsPage() {
  const questions = [
    {
      title: "When is the wedding?",
      answer: (
        <div>
          Saturday 23rd May 2026 in beautiful Suffolk.
          <div className="mt-2 italic">
            Please arrive from <strong>1:30pm </strong>— the ceremony will begin
            promptly at <strong>2:00pm</strong>
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
          <div className="mt-2 text-base space-y-1">
            <p>
              <strong>Address:</strong> High St, Lavenham, Sudbury CO10 9QA
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              <a
                href="tel:01787247477"
                className="underline hover:text-[#4b6c52]"
              >
                01787 247477
              </a>
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
            href="mailto:hello@vanrileywedding.co.uk"
            className="underline text-[#4b6c52] hover:text-[#2a2a2a]"
          >
            hello@vanrileywedding.co.uk
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
