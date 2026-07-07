import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // /admin (painel do escritório) e /api ficam fora do índice dos buscadores.
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
