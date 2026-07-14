import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Maria i Michał Czujko | Album Ślubny",
    short_name: "Czujko Album",
    description: "Album ślubny Marii i Michała Czujko — wspomnienia, księga gości i multimedia.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f5",
    theme_color: "#9f7aea",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
