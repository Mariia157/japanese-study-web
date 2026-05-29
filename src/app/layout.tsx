import type { Metadata } from "next";
import { Geist, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const notoJp = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Nihongo SRS — Japanese Learning",
  description: "Personal Japanese learning app with spaced repetition (JLPT N5–N1)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${notoJp.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Nav />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
