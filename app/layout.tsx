import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getThemeStyle } from "@/lib/ui/theme";
import "@/lib/ui/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Fallback only - both app/(store) and app/admin set their own more specific
// title template via generateMetadata/metadata. This is what shows up on
// segments with no more specific metadata of their own (e.g. app/not-found.tsx).
export const metadata: Metadata = {
  title: "Store",
  description: "A storefront built on the Tebex Headless API.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeStyle = await getThemeStyle();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <style id="theme-vars" dangerouslySetInnerHTML={{ __html: themeStyle }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
