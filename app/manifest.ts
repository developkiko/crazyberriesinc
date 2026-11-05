import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Crazy Berries — Rare European Dried Berries",
    short_name: "CrazyBerries",
    description:
      "Rare European dried berries, cold-pressed juices and dark chocolate-covered treats. Unsulfured, non-GMO.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff8f1",
    theme_color: "#8e1f3f",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
