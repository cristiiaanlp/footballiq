import type { MetadataRoute } from "next";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://footballiq-cristiiaanlps-projects.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/login", "/register"];
  return routes.map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.6,
  }));
}
