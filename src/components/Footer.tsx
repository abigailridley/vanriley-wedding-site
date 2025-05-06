// components/footer.tsx
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} VanRiley Wedding. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
