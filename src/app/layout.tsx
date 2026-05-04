import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Absolute Offroad | 4x4 Fitment Centre",
  description: "Workshop portal for Absolute Offroad — jobs, vehicle checklists, task updates and photo uploads for your 4x4 fitment centre.",
  keywords: ["4x4", "fitment", "offroad", "workshop", "Absolute Offroad"],
  authors: [{ name: "Absolute Offroad" }],
  openGraph: {
    title: "Absolute Offroad | 4x4 Fitment Centre",
    description: "Workshop portal for Absolute Offroad.",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Absolute Offroad",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Absolute Offroad | 4x4 Fitment Centre",
    description: "Workshop portal for Absolute Offroad.",
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
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen`}
      >
        {/* Wrap the entire app in the AuthProvider */}
        <AuthProvider>
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}