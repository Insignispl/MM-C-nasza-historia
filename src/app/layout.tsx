import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#9f7aea",
};

export const metadata: Metadata = {
  title: { default: "Story Atelier | Fotografia i Event Story", template: "%s | Story Atelier" },
  description: "Story Atelier tworzy reporterskie fotografie i cyfrowe opowieści o najważniejszych wydarzeniach.",
  keywords: ["fotografia reportażowa", "fotografia ślubna", "event story", "fotograf eventowy"],
  authors: [{ name: "Story Atelier" }],
  openGraph: { type: "website", locale: "pl_PL", siteName: "Story Atelier", title: "Story Atelier | Fotografia i Event Story", description: "Reporterskie fotografie i cyfrowe opowieści o najważniejszych wydarzeniach." },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Story Atelier",
    description: "Fotografia reporterska i Event Story.",
    areaServed: "Polska",
  };

  return (
    <html lang="pl" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased bg-gradient-wedding font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Przejdź do treści
        </a>
        <Navbar />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
