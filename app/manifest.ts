import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jesulayomi & Justin — #j2everyday",
    short_name: "j2everyday",
    description:
      "Join Jesulayomi & Justin as they celebrate their wedding on November 7, 2026.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F3EC",
    theme_color: "#4A3429",
    icons: [
      {
        src: "/favicon.png",
        sizes: "any",
        type: "image/png",
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
