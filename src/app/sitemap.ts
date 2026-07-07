import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { areas } from "@/data/areas";
import { team } from "@/data/team";
import { getAllPosts } from "@/lib/blog";
import { servidorPages } from "@/data/servidores";

// Dinâmico: reflete os posts publicados no /admin a cada requisição.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

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
    ...team
      .filter((m) => m.hasProfile)
      .map((m) => ({
        url: `${site.url}/equipe/${m.slug}`,
        changeFrequency: "yearly" as const,
        priority: 0.5,
      })),
    ...posts.map((p) => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: p.updatedAt ?? p.date,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
