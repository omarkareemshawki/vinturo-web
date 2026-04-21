'use client';
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import { usePathname } from "next/navigation";

export const metadata: Metadata = {
  title: "Venturo — MMXXVI",
  description: "Forbidden Odyssey. Explorer's Quest. A collection born from the edge of the known world.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <html lang="en">
      <body>
        <CustomCursor />
        {!isAdmin && <Navbar />}
        <main>{children}</main>
        {!isAdmin && <Footer />}
      </body>
    </html>
  );
}