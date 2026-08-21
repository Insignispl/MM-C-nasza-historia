import { KONTAKT, LOKALIZACJE, USLUGI } from "@/lib/oferta";

/**
 * Dane strukturalne schema.org.
 *
 * PO CO: to one decyduja o wynikach lokalnych w Google (panel po prawej, mapa,
 * godziny, telefon) i one sa czytane przez wyszukiwarki generatywne, ktore odpowiadaja
 * zdaniem, a nie lista linkow. Tekst na stronie musza zrozumiec z kontekstu; tutaj
 * dostaja fakty wprost.
 *
 * DWA WPISY LOCALBUSINESS, NIE JEDEN: Google wiaze wynik lokalny z FIZYCZNYM adresem,
 * wiec kazde biuro musi byc osobnym obiektem. Jeden wpis z dwoma adresami sprawia,
 * ze zaden z nich nie rankuje poprawnie w swoim miescie.
 *
 * CZEGO TU NIE MA I DLACZEGO: wspolrzednych geograficznych. Zmyslone dane w tym
 * miejscu szkodza bardziej niz ich brak, bo Google porownuje je z profilem firmy
 * i wizytowkami w katalogach. Uzupelnic, gdy beda znane.
 */

const NAZWA = "Story Atelier";

/**
 * Godziny biura podane przez wlasciciela: 9-17.
 *
 * ZALOZENIE DO POTWIERDZENIA: przyjete jako dni robocze. Wlasciciel nie podal dni,
 * a "9-17" w praktyce oznacza biuro, nie obsluge wesela - te odbywaja sie w weekendy
 * i o innych godzinach. Gdyby biuro pracowalo takze w sobote, trzeba dopisac dzien:
 * rozbieznosc z profilem Google obniza zaufanie do calej wizytowki.
 */
const GODZINY = {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  opens: "09:00",
  closes: "17:00",
};

function adres(lokalizacja: (typeof LOKALIZACJE)[number]) {
  return {
    "@type": "PostalAddress",
    streetAddress: lokalizacja.ulica,
    addressLocality: lokalizacja.miasto,
    addressCountry: "PL",
    ...(lokalizacja.kod ? { postalCode: lokalizacja.kod } : {}),
  };
}

export function danePolStrukturalne(bazowyUrl: string) {
  const organizacja = {
    "@type": "Organization",
    "@id": `${bazowyUrl}/#organizacja`,
    name: NAZWA,
    url: bazowyUrl,
    email: KONTAKT.email,
    telephone: KONTAKT.telHref,
    areaServed: ["Wrocław", "Polkowice", "Dolnośląskie", "Polska"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Usługi Story Atelier",
      itemListElement: USLUGI.map((usluga) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: usluga.tytul,
          description: usluga.opis,
        },
      })),
    },
  };

  const biura = LOKALIZACJE.map((lokalizacja) => ({
    "@type": lokalizacja.studioNagran ? "RecordingStudio" : "LocalBusiness",
    "@id": `${bazowyUrl}/#biuro-${lokalizacja.miasto.toLowerCase()}`,
    name: `${NAZWA} ${lokalizacja.miasto}`,
    description: lokalizacja.opis,
    url: lokalizacja.studioNagran ? `${bazowyUrl}/studio` : bazowyUrl,
    email: KONTAKT.email,
    telephone: KONTAKT.telHref,
    address: adres(lokalizacja),
    openingHoursSpecification: [GODZINY],
    parentOrganization: { "@id": `${bazowyUrl}/#organizacja` },
  }));

  return { "@context": "https://schema.org", "@graph": [organizacja, ...biura] };
}
