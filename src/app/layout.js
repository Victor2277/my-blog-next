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
  title: "Maggie的美食旅遊筆記 - 探索台灣隱藏版美食",
  description: "探索台灣各地隱藏版美食與絕美景點！Maggie的美食旅遊筆記專注於分享最真實的味蕾體驗與旅遊攻略，帶你走遍充滿人情味的巷弄小店，發掘在地人才知道的私房名單，一起享受質感生活點滴与美好食光。",
  verification: {
    google: "idYSTBLF6xJYrsCR0r7D8niiMTaoyiQSLq-uCnTljcc",
  },
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
