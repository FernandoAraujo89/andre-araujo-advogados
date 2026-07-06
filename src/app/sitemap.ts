import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { areas } from "@/data/areas";
import { team } from "@/data/team";
import { posts } from "@/data/posts";
import { servidorPages } from "@/data/servidores";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/o-escritorio",
    "/areas-de-atuacao",
    "/equipe",
    "/blog",
    "/servidores-publicos",
    "/faq",
    "/contato",
    "/politica-de-privacidade",
  ];

  return [
    ...staticPaths.map((path) => ({
      url: `${site.url}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...areas.map((a) => ({
      url: `${site.url}/areas-de-atuacao/${a.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...servidorPages.map((p) => ({
      url: `${site.url}/servidores-publicos/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...team.map((l) => ({
      url: `${site.url}/equipe/${l.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    ...posts.map((p) => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: p.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
