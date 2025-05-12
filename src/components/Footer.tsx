// components/footer.tsx
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="max-w-6xl mx-auto text-center space-y-2">
        <p className="text-sm">
          💌 Contact us at{" "}
          <a
            href="mailto:hello@vanrileywedding.co.uk"
            className="underline hover:text-gray-300"
          >
            hello@vanrileywedding.co.uk
          </a>
        </p>
        <p className="text-sm">
          © {new Date().getFullYear()} VanRiley Wedding. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
