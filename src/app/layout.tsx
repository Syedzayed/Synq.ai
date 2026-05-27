import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Synq — Find people who move like you.",
  description:
    "AI-powered networking for builders, creators, researchers, and ambitious teams. Stop cold outreach. Start meaningful connections.",
  keywords: ["networking", "AI", "collaboration", "founders", "builders"],
  openGraph: {
    title: "Synq — Find people who move like you.",
    description:
      "AI-powered networking for builders, creators, and ambitious teams.",
    type: "website",
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
      <body className="min-h-full flex flex-col bg-[#020206] text-white">
        {children}
      </body>
    </html>
  );
}
