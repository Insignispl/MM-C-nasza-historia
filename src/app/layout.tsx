import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Bricolage_Grotesque, Great_Vibes, Inter } from "next/font/google";
import { danePolStrukturalne } from "@/lib/seo";
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

// Krój logotypu, dobrany do kaligrafii wymalowanej na ścianie studia.
// Wyłącznie do nazwy marki - skrypty w małych stopniach i w dłuższym tekście
// stają się nieczytelne, więc interfejs zostaje na groteskach.
const greatVibes = Great_Vibes({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: "400",
  variable: "--font-greatvibes",
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
  // Bez metadataBase wszystkie adresy relatywne (canonical, obrazy og) Next
  // rozwiazuje wzgledem localhost, wiec na produkcji trafialyby w nikad.
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"),
  title: { default: "Story Atelier | Fotografia, film i studio nagrań. Wrocław i Polkowice", template: "%s | Story Atelier" },
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
  // Dane strukturalne budowane z jednego zrodla (oferta.ts), zeby adresy i telefon
  // w schema.org nie rozjechaly sie z tym, co widzi czlowiek na stronie.
  const jsonLd = danePolStrukturalne(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000");

  return (
    // suppressHydrationWarning dotyczy WYLACZNIE tego elementu i jego atrybutow:
    // skrypt w <head> dopisuje data-theme przed hydratacja, wiec serwer i klient
    // z definicji sie tu roznia. Nie tlumi to rozjazdow w tresci strony.
    <html lang="pl" suppressHydrationWarning className={`${inter.variable} ${bricolage.variable} ${greatVibes.variable}`}>
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
