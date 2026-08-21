// Wszystko pod /e/ to prywatna pamiatka konkretnej pary: album, ksiega gosci,
// fotobudka. robots.txt tylko PROSI o nieodwiedzanie i jest publiczny, wiec sam
// w sobie oglasza swiatu, ze taki katalog istnieje. Naglowek noindex dziala
// nawet wtedy, gdy ktos wklei link na forum albo w social mediach.
//
// Layout, a nie cztery osobne eksporty w stronach - kazda nowa trasa pod /e/
// dziedziczy to automatycznie i nie da sie o tym zapomniec.
export const metadata = { robots: { index: false, follow: false } };

export default function PrywatneWydarzenieLayout({ children }: { children: React.ReactNode }) {
  return children;
}
