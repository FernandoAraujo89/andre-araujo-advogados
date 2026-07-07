import type { Metadata } from "next";
import { site } from "@/data/site";

/**
 * Gera metadata consistente por página.
 * title: até 60 caracteres | description: até 155 caracteres.
 * Para posts, passe `type: "article"`, a `image` de capa e as datas.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const url = `${site.url}${path === "/" ? "" : path}`;
  const images = image ? [{ url: image }] : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: "pt_BR",
      type,
      images,
      ...(type === "article" ? { publishedTime, modifiedTime } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
