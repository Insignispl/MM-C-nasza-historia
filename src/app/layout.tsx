import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { THEME_BOOTSTRAP_SCRIPT } from "@/lib/theme";

// latin-ext jest KONIECZNY: polskie ł ą ę ś ż ź ć ń nie wystepuja w podzbiorze latin,
// wiec bez niego przegladarka rysuje je krojem zastepczym w srodku wyrazu.
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-bricolage",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ebe9e5" },
    { media: "(prefers-color-scheme: dark)", color: "#211e1c" },
  ],
};

export const metadata: Metadata = {
  title: { default: "Story Atelier | Fotografia, film i studio nagrań — Wrocław i Polkowice", template: "%s | Story Atelier" },
  description: "Reportaż ślubny, film z gimbala i drona, wideo na zamówienie oraz wynajem studia nagraniowego we Wrocławiu. Dwa biura: Wrocław i Polkowice.",
  keywords: ["fotograf ślubny Wrocław", "fotograf Polkowice", "film ślubny", "studio nagraniowe Wrocław", "wynajem studia podcast", "wideo na zamówienie", "dron", "kamerzysta na wesele"],
  authors: [{ name: "Story Atelier" }],
  openGraph: { type: "website", locale: "pl_PL", siteName: "Story Atelier", title: "Story Atelier | Fotografia, film i studio nagrań", description: "Reportaż ślubny, film, wideo na zamówienie i wynajem studia nagraniowego. Wrocław i Polkowice." },
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
    // suppressHydrationWarning dotyczy WYLACZNIE tego elementu i jego atrybutow:
    // skrypt w <head> dopisuje data-theme przed hydratacja, wiec serwer i klient
    // z definicji sie tu roznia. Nie tlumi to rozjazdow w tresci strony.
    <html lang="pl" suppressHydrationWarning className={`${inter.variable} ${bricolage.variable}`}>
      <head>
        {/* Musi byc pierwszy i synchroniczny: ustawia motyw przed pierwszym malowaniem,
            inaczej na projektorze w zaciemnionej sali widac blysk bialego tla. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
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
