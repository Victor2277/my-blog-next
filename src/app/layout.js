import { Inter, Merriweather } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
});

export const metadata = {
  title: "My Blog",
  description: "A commercial blog platform built with Next.js and Supabase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <head>
        <meta name="referrer" content="no-referrer" />
      </head>
      <body
        className={`${inter.variable} ${merriweather.variable} antialiased bg-brand-50 text-brand-900 font-sans`}
      >
        <Navbar />
        <main className="flex-grow pt-8 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
