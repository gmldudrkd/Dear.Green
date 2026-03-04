import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dear Earth - 친애하는 지구에게",
    short_name: "Dear Earth",
    description: "당신의 식탁과 지구 사이, 다정한 거리를 만드는 기록",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f5",
    theme_color: "#5c845c",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
