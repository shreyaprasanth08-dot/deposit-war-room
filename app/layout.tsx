import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DemoBanner from "@/components/demo/DemoBanner";

export const metadata: Metadata = {
  title: "The Deposit War Room | Karnataka Rental Deposit ODR",
  description: "Online Dispute Resolution (ODR) platform for residential tenancy deposit disputes in Bengaluru, Karnataka.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <DemoBanner />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
