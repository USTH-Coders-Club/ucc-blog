import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://blog.usthcoders.club'),
  title: {
    template: '%s | USTH Coders Club',
    default: 'USTH Coders Club Technical Blog'
  },
  description: "Technical articles and insights from the USTH Coders Club covering Cyber Security, AI, Blockchain, Web3, Cloud, DevOps, and Software Engineering.",
  keywords: ["USTH", "Coders Club", "Technical Blog", "Cyber Security", "AI", "Blockchain", "Web3", "Cloud", "DevOps", "Software Engineering"],
  authors: [{ name: "USTH Coders Club" }],
  openGraph: {
    title: "USTH Coders Club Technical Blog",
    description: "Technical articles and insights from the USTH Coders Club",
    url: "https://blog.usthcoders.club",
    siteName: "USTH Coders Club Blog",
    images: [
      {
        url: "/ucc_logo_black.png",
        width: 800,
        height: 600,
        alt: "USTH Coders Club Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "USTH Coders Club Technical Blog",
    description: "Technical articles and insights from the USTH Coders Club",
    images: ["/ucc_logo_black.png"],
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
        className={`${spaceGrotesk.variable} ${manrope.variable} antialiased`}
      >
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
