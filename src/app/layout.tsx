import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif, Geist_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Synq — Find people who move like you.",
  description:
    "AI-powered networking for builders, creators, researchers, and ambitious teams. Stop cold outreach. Start meaningful connections.",
  keywords: [
    "networking",
    "AI",
    "collaboration",
    "founders",
    "builders",
    "startup",
    "semantic matching",
    "professional network",
  ],
  authors: [{ name: "Synq" }],
  creator: "Synq",
  openGraph: {
    title: "Synq — Find people who move like you.",
    description:
      "AI-powered networking for builders, creators, and ambitious teams.",
    type: "website",
    siteName: "Synq",
  },
  twitter: {
    card: "summary_large_image",
    title: "Synq — Find people who move like you.",
    description:
      "AI-powered networking for builders, creators, and ambitious teams.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#fdfbf7",
};

import { SessionTimeoutProvider } from "@/components/auth/session-timeout-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${instrumentSerif.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col overflow-x-hidden"
        style={{ background: "#fdfbf7", color: "#1e1a17" }}
      >
        <SessionTimeoutProvider>
          {children}
        </SessionTimeoutProvider>
      </body>
    </html>
  );
}
