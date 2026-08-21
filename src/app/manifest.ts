import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Story Atelier | Fotografia, film i studio nagrań",
    short_name: "Story Atelier",
    description: "Reportaż ślubny, film, wideo na zamówienie i wynajem studia nagraniowego. Wrocław i Polkowice.",
    start_url: "/",
    display: "standalone",
    background_color: "#0e0e11",
    theme_color: "#0e0e11",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}