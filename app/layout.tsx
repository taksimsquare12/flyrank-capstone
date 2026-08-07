import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Capstone Movie App",
  description: "FlyRank Frontend AI Engineering Capstone Project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">
        <nav className="p-4 border-b bg-gray-100 flex gap-6 font-medium">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/movies" className="hover:underline">Movies</Link>
          <Link href="/favorites" className="hover:underline">Favorites</Link>
          <Link href="/health-check" className="hover:underline text-green-700">
            Health Check
          </Link>
        </nav>
        {children}
      </body>
    </html>
  );
}