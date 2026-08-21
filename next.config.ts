import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  turbopack: {
    root: "C:\\Users\\horyz\\CascadeProjects\\album-slubny",
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "127.0.0.1:3000", "127.0.0.1:63927"],
    },
  },
  // Stare trasy prywatnego albumu zostaly usuniete. Przekierowania zostaja dla linkow,
  // ktore moga jeszcze krazyc u gosci poprzedniego wesela.
  async redirects() {
    return [
      { source: "/album", destination: "/", permanent: true },
      { source: "/ksiega", destination: "/", permanent: true },
      { source: "/dodaj", destination: "/", permanent: true },
      { source: "/admin", destination: "/", permanent: true },
      { source: "/login", destination: "/", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
