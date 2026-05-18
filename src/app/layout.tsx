import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { NotificationModal } from "@/components/layout/NotificationModal";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Satta Result - Live Daily Results & Chart Records",
    template: "%s | Satta Result",
  },
  description:
    "View live daily results for Gali, Desawar, Ghaziabad, Faridabad and more. Check historical chart records and get instant notifications.",
  keywords: [
    "satta result",
    "daily results",
    "live results",
    "chart records",
    "Gali result",
    "Desawar result",
    "Ghaziabad result",
    "Faridabad result",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Satta Result",
    title: "Satta Result - Live Daily Results",
    description:
      "View live daily results for Gali, Desawar, Ghaziabad, Faridabad. Check chart records.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <Toaster position="top-right" />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <NotificationModal />
      </body>
    </html>
  );
}
