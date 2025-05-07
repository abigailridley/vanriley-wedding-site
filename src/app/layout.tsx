import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  Bodoni_Moda,
  Dancing_Script,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  style: ["normal"],
});
const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  style: ["normal"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  style: ["normal"],
});

export const metadata = {
  title: "Van-Riley Wedding",
  description: "RSVP and Accommodation for the VanRiley Wedding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dancingScript.variable} 
      ${bodoniModa.variable}
      ${playfairDisplay.variable}
      antialiased`}
      >
        {/* Header */}
        <Header />

        {/* Main content */}
        <main className="flex-grow">{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
