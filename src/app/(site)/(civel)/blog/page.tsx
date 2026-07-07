import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import BlogList from "@/components/BlogList";
import { getAllPosts } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description:
    "Artigos do André Araújo Advogados, em Formiga, MG: direito imobiliário, empresarial, do consumidor, tributário e servidor público em linguagem clara.",
  path: "/blog",
});

// Renderização dinâmica: lê o Blob a cada requisição — publicar reflete na
// hora. Segue SSR (SEO completo).
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const ordered = await getAllPosts();
  return (
    <div className="px-5 pb-28 pt-36 lg:px-8 lg:pb-36">
      <div className="mx-auto max-w-[1240px]">
        <Breadcrumbs items={[{ label: "Blog" }]} />
        <Reveal>
          <SectionHeading
            as="h1"
            title="Informação jurídica em linguagem clara"
            description="Artigos sobre os temas que afetam o dia a dia de pessoas, condomínios e empresas de Formiga e região."
          />
        </Reveal>
        <div className="mt-14">
          <BlogList posts={ordered} />
        </div>
      </div>
    </div>
  );
}
