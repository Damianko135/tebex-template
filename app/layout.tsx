import type { Metadata } from "next";
import { Geist_Mono, Libre_Caslon_Display, Libre_Caslon_Text, Public_Sans } from "next/font/google";
import { getThemeStyle } from "@/lib/ui/theme";
import "@/lib/ui/globals.css";

// Public Sans (the US Web Design System's typeface) for body/UI text - built
// for institutional clarity and legibility, which fits "professional,
// trustworthy, storefront-focused" better than a trend-driven grotesque.
const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

// Libre Caslon Text for mid-scale headings (card/sheet/empty-state titles,
// section headings) - a classical, crisp serif for editorial confidence
// without the softness of a warm humanist display serif.
const libreCaslonText = Libre_Caslon_Text({
  variable: "--font-libre-caslon-text",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Libre Caslon Display, reserved for hero/large-scale display type only
// (see --font-display in globals.css) - a display-only cut, not meant for
// small sizes.
const libreCaslonDisplay = Libre_Caslon_Display({
  variable: "--font-libre-caslon-display",
  subsets: ["latin"],
  weight: "400",
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
  description: "A storefront for buying in-game items and perks.",
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
      className={`${publicSans.variable} ${libreCaslonText.variable} ${libreCaslonDisplay.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <style id="theme-vars" dangerouslySetInnerHTML={{ __html: themeStyle }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
