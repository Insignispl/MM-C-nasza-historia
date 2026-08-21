import { KONTAKT } from "@/lib/oferta";
import { createClient } from "@/lib/supabase/server";
import { PYTANIA_KONTAKTOWE, sciezkaPoId } from "@/lib/zapytania";
import { NextResponse } from "next/server";

type Wejscie = {
  sciezka?: unknown;
  odpowiedzi?: unknown;
  /** Pulapka na boty: pole ukryte w formularzu. Czlowiek go nie wypelni. */
  strona?: unknown;
};

const MAX_DLUGOSC_ODPOWIEDZI = 4000;

function tekst(wartosc: unknown): string {
  if (typeof wartosc === "string") return wartosc.trim();
  if (Array.isArray(wartosc)) return wartosc.filter((v) => typeof v === "string").join(", ");
  if (typeof wartosc === "number") return String(wartosc);
  return "";
}

export async function POST(request: Request) {
  let dane: Wejscie;
  try {
    dane = (await request.json()) as Wejscie;
  } catch {
    return NextResponse.json({ blad: "Nieprawidłowe dane." }, { status: 400 });
  }

  // Pulapka na boty. Odpowiadamy sukcesem, zeby bot nie dostal sygnalu, ze go wykryto.
  if (tekst(dane.strona).length > 0) return NextResponse.json({ ok: true });

  const sciezka = sciezkaPoId(tekst(dane.sciezka));
  if (!sciezka) return NextResponse.json({ blad: "Nieznany rodzaj zapytania." }, { status: 400 });

  const surowe = (dane.odpowiedzi ?? {}) as Record<string, unknown>;

  // Walidacja po stronie SERWERA, nie tylko w przegladarce: pola wymagane mozna
  // obejsc, wysylajac zapytanie bezposrednio, a tabela ma wlasne ograniczenia,
  // ktorych naruszenie dalo by bledny komunikat zamiast czytelnego.
  const brakujace = [...sciezka.pytania, ...PYTANIA_KONTAKTOWE]
    .filter((pytanie) => pytanie.wymagane && tekst(surowe[pytanie.id]).length === 0)
    .map((pytanie) => pytanie.etykieta);

  if (brakujace.length > 0) {
    return NextResponse.json({ blad: `Uzupełnij: ${brakujace.join(", ")}.` }, { status: 422 });
  }

  const email = tekst(surowe.email);
  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) {
    return NextResponse.json({ blad: "Sprawdź adres e-mail." }, { status: 422 });
  }

  const odpowiedzi: Record<string, string> = {};
  for (const pytanie of sciezka.pytania) {
    const wartosc = tekst(surowe[pytanie.id]).slice(0, MAX_DLUGOSC_ODPOWIEDZI);
    if (wartosc) odpowiedzi[pytanie.etykieta] = wartosc;
  }

  // Identyfikator generujemy TUTAJ, a nie odczytujemy z bazy przez `.select()`.
  // Powod jest w politykach RLS: anon ma wylacznie INSERT, bo zapytania to dane
  // osobowe i nikt z ulicy nie moze ich czytac. Odczytanie wlasnie wstawionego
  // wiersza tez jest odczytem, wiec `insert().select()` konczy sie odmowa.
  // Poprawka nie polega na poluzowaniu polityki, tylko na tym, by nie prosic.
  const id = crypto.randomUUID();

  const supabase = await createClient();
  const { error } = await supabase
    .from("inquiries")
    .insert({
      id,
      sciezka: sciezka.id,
      imie: tekst(surowe.imie).slice(0, 120),
      email,
      telefon: tekst(surowe.telefon).slice(0, 40) || null,
      uwagi: tekst(surowe.uwagi).slice(0, MAX_DLUGOSC_ODPOWIEDZI) || null,
      skad: tekst(surowe.skad).slice(0, 120) || null,
      odpowiedzi,
    });

  if (error) {
    // Szczegoly bledu bazy TYLKO w rozwoju. W produkcji ujawnialyby strukture
    // tabeli i tresc polityk, a klientowi i tak nic nie daja.
    return NextResponse.json(
      {
        blad: "Nie udało się zapisać zapytania. Zadzwoń albo napisz mailem.",
        ...(process.env.NODE_ENV === "production" ? {} : { szczegoly: error.message }),
      },
      { status: 500 },
    );
  }

  // Od tego miejsca zapytanie JUZ JEST zapisane. Wysylka maila nie moze wplynac
  // na odpowiedz dla klienta - inaczej awaria Resend wygladalaby jak utrata zapytania.
  void powiadom(sciezka.nazwa, odpowiedzi, surowe, id);

  return NextResponse.json({ ok: true });
}

async function powiadom(
  nazwaSciezki: string,
  odpowiedzi: Record<string, string>,
  surowe: Record<string, unknown>,
  id: string,
) {
  const klucz = process.env.RESEND_API_KEY;
  if (!klucz) return;

  const nadawca = process.env.RESEND_FROM ?? "Story Atelier <formularz@storyatelier.pl>";
  const wiersze = [
    `Rodzaj: ${nazwaSciezki}`,
    `Imię: ${tekst(surowe.imie)}`,
    `E-mail: ${tekst(surowe.email)}`,
    `Telefon: ${tekst(surowe.telefon) || "brak"}`,
    `Skąd o nas wie: ${tekst(surowe.skad) || "brak"}`,
    "",
    ...Object.entries(odpowiedzi).map(([etykieta, wartosc]) => `${etykieta}: ${wartosc}`),
    "",
    `Uwagi: ${tekst(surowe.uwagi) || "brak"}`,
  ];

  try {
    const odpowiedz = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${klucz}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: nadawca,
        to: [KONTAKT.email],
        reply_to: tekst(surowe.email),
        subject: `Zapytanie: ${nazwaSciezki}, ${tekst(surowe.imie)}`,
        text: wiersze.join("\n"),
      }),
    });
    if (!odpowiedz.ok) return;
    await oznaczWyslane(id);
  } catch {
    // Cisza jest tu celowa: zapytanie jest ZAPISANE, a brak znacznika
    // `powiadomienie_wyslane_at` pokazuje w panelu, ktore trzeba obejrzec recznie.
  }
}

/**
 * Znaczy zapytanie jako powiadomione.
 *
 * Wymaga klucza service_role, bo polityki RLS daja UPDATE tylko zalogowanym,
 * a ta funkcja dziala bez sesji uzytkownika. Proba przez klienta anon konczylaby
 * sie CICHA odmowa - czyli dokladnie tym rodzajem awarii, ktory ten kod ma wykluczac.
 * Bez klucza po prostu nie znaczymy: mail idzie, a kolumna zostaje NULL i uczciwie
 * pokazuje, ze wysylki nie potwierdzono.
 */
async function oznaczWyslane(id: string) {
  const serwis = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serwis || !url) return;

  await fetch(`${url}/rest/v1/inquiries?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      apikey: serwis,
      Authorization: `Bearer ${serwis}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ powiadomienie_wyslane_at: new Date().toISOString() }),
  });
}
