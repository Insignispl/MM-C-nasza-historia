export type Theme = "light" | "dark" | "hall";

export const THEME_STORAGE_KEY = "story-atelier-theme";

/** Wybor zapisany na tym urzadzeniu. null = brak wyboru, decyduje ustawienie systemu. */
export function storedTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(THEME_STORAGE_KEY);
  return value === "light" || value === "dark" || value === "hall" ? value : null;
}

const sluchacze = new Set<() => void>();

/** Subskrypcja dla `useSyncExternalStore`: wlasne zmiany + zmiany z innych kart. */
export function subscribeTheme(onChange: () => void) {
  sluchacze.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    sluchacze.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Zapisuje wybor urzadzenia. `null` kasuje wybor i oddaje decyzje polityce. */
export function setStoredTheme(theme: Theme | null) {
  if (theme) window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  else window.localStorage.removeItem(THEME_STORAGE_KEY);
  sluchacze.forEach((onChange) => onChange());
}

export function applyTheme(theme: Theme | null) {
  const root = document.documentElement;
  if (theme) root.setAttribute("data-theme", theme);
  else root.removeAttribute("data-theme");
}

export type Surface = "album" | "fotobudka" | "live";

/**
 * Rozstrzyga, jaki motyw dostaje ten ekran.
 *
 * Polityka opiera sie na jednym rozroznieniu: CZYJ jest ekran.
 *
 * 1. Wybor zapisany na urzadzeniu wygrywa zawsze. Ktos stanal przed tym ekranem
 *    i swiadomie wybral - zadne ustawienie zdalne nie ma prawa go cofnac.
 * 2. Album to CUDZY telefon, wiec zwracamy `null` i oddajemy glos systemowi goscia.
 *    Ustawienie ciemnego motywu w telefonie bywa decyzja o czytelnosci, nie o guscie
 *    (swiatlowstret, migrena, slabszy wzrok). Nadpisanie go dla spojnosci marki
 *    zamienia pamiatke w cos, czego czesc gosci nie moze wygodnie ogladac.
 * 3. Fotobudka i Live Wall to URZADZENIA fotografa stojace w zaciemnionej sali.
 *    Tam domyslny jest tryb sali, a ustawienie wesela pozwala to nadpisac -
 *    np. na plenerze w poludnie, gdzie czarny ekran znika w sloncu.
 *
 * `null` NIE oznacza "jasny": arkusz ma blok `prefers-color-scheme`, wiec brak
 * atrybutu `data-theme` to oddanie decyzji przegladarce, a nie wymuszenie jasnego.
 */
export function resolveTheme(input: { surface: Surface; device: Theme | null; event: Theme | null }): Theme | null {
  if (input.device) return input.device;
  if (input.surface === "album") return null;
  return input.event ?? "hall";
}

/** Powierzchnia rozpoznana ze sciezki - jedyne, co wiadomo, zanim dojda dane z bazy. */
export function surfaceFromPath(pathname: string): Surface {
  if (pathname.endsWith("/fotobudka")) return "fotobudka";
  if (pathname.endsWith("/live")) return "live";
  return "album";
}

/**
 * Ten sam zestaw regul co `resolveTheme`, ale wykonywany synchronicznie w <head>,
 * zanim przegladarka cokolwiek narysuje - inaczej na projektorze w zaciemnionej sali
 * widac mignięcie bialego tla, zanim React zdazy nalozyc atrybut.
 *
 * Rozni sie w jednym punkcie i jest to swiadome: ustawienie wesela siedzi w bazie,
 * wiec tutaj jeszcze go nie ma. Urzadzenia startuja od trybu sali, a `ThemeController`
 * koryguje motyw po dociagnieciu danych. Mignięcie z ciemnego na jasny jest znosne,
 * odwrotne nie jest.
 */
export const THEME_BOOTSTRAP_SCRIPT = `(function(){try{
var k=${JSON.stringify(THEME_STORAGE_KEY)};
var d=document.documentElement;
var s=localStorage.getItem(k);
if(s==="light"||s==="dark"||s==="hall"){d.setAttribute("data-theme",s);return;}
var p=location.pathname;
if(p.slice(-10)==="/fotobudka"||p.slice(-5)==="/live"){d.setAttribute("data-theme","hall");return;}
d.removeAttribute("data-theme");
}catch(e){}})();`;
