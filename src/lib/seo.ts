import type { Metadata } from "next";
import { site } from "@/data/site";

/**
 * Gera metadata consistente por página.
 * title: até 60 caracteres | description: até 155 caracteres.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${site.url}${path === "/" ? "" : path}`;
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
      type: "website",
    },
  };
}
