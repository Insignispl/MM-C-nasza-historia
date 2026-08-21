/**
 * Dane administratora do polityki prywatności.
 *
 * DLACZEGO OSOBNY PLIK Z FLAGĄ: polityka prywatności to dokument prawny. Brakujące
 * dane administratora (pełna nazwa, adres rejestrowy, NIP) albo nieustalone okresy
 * przechowywania sprawiają, że obowiązek informacyjny z art. 13 RODO NIE jest
 * spełniony, mimo że strona z polityką istnieje.
 *
 * Dlatego flaga `KOMPLETNA` musi zostać ręcznie ustawiona na `true` po uzupełnieniu
 * pól. Dopóki jest `false`, strona wyświetla widoczne ostrzeżenie, że dokument jest
 * projektem. To zabezpieczenie przed cichą publikacją niedokończonego dokumentu.
 */

export const ADMINISTRATOR = {
  /** Pełna nazwa podmiotu z rejestru. */
  nazwa: "",
  /** Adres rejestrowy, jeśli inny niż biura. */
  adresRejestrowy: "",
  nip: "",
  /** Okres przechowywania zapytań z formularza, np. "12 miesięcy". */
  retencjaZapytan: "",
  /** Okres przechowywania materiałów z wydarzeń, np. "24 miesiące po wydarzeniu". */
  retencjaMaterialow: "",
  /** Region, w którym Supabase przechowuje dane (np. "Unia Europejska, Frankfurt"). */
  regionDanych: "",
};

export const POLA_DO_UZUPELNIENIA = Object.entries(ADMINISTRATOR)
  .filter(([, wartosc]) => wartosc.trim().length === 0)
  .map(([klucz]) => klucz);

export const KOMPLETNA = POLA_DO_UZUPELNIENIA.length === 0;
