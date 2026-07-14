import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Inter, Playfair_Display } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import { formatWeddingDate } from "@/lib/utils";

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

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("wedding_settings")
    .select("couple_name,wedding_date,location")
    .single();

  const title = `${settings?.couple_name ?? "Maria i Michał Czujko"} | ${formatWeddingDate(settings?.wedding_date) ?? "27 czerwca 2026"} | ${settings?.location ?? "Polkowice"}`;
  const description = `Pamiątkowa strona ślubna ${settings?.couple_name ?? "Marii i Michała Czujko"}. Zobacz zdjęcia, filmy i zostaw wpis w księdze gości.`;

  return {
    title,
    description,
    keywords: ["ślub", "album ślubny", "wesele", "zdjęcia ślubne", "księga gości", "Polkowice"],
    authors: [{ name: settings?.couple_name ?? "Maria i Michał Czujko" }],
    openGraph: {
      title,
      description,
      type: "website",
      locale: "pl_PL",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("wedding_settings")
    .select("couple_name,wedding_date,location")
    .single();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `Ślub ${settings?.couple_name ?? "Marii i Michała Czujko"}`,
    startDate: settings?.wedding_date ?? "2026-06-27",
    location: {
      "@type": "Place",
      name: settings?.location ?? "Polkowice",
      address: {
        "@type": "PostalAddress",
        addressLocality: settings?.location ?? "Polkowice",
        addressCountry: "PL",
      },
    },
    description: "Pamiątkowa strona ślubna ze zdjęciami, filmami i księgą gości.",
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
