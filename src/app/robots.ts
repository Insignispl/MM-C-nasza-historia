import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Panel oraz prywatne strony konkretnych wydarzen nie naleza do wyszukiwarki.
      disallow: ["/fotograf", "/e/"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/sitemap.xml`,
  };
}
