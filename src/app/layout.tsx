import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Keshav Rao | AI/ML Engineer",
  description: "Portfolio of Keshav Rao - Software Developer & AI/ML Engineer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${manrope.className} overflow-x-hidden bg-[#ececec] text-zinc-900 antialiased transition-colors duration-500`}>
        {children}
      </body>
    </html>
  );
}