// app/layout.tsx
import Footer from "@/components/footer";
import Header from "@/components/header";
import "@/styles/globals.css";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
