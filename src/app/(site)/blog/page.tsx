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
    "Artigos do André Araújo Advogados: direito imobiliário, empresarial, do consumidor, tributário e servidor público em linguagem clara.",
  path: "/blog",
});

// Renderização dinâmica: lê o Blob a cada requisição — publicar reflete na
// hora. Segue SSR (SEO completo).
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const ordered = await getAllPosts();
  return (
    <div className="px-5 pb-28 pt-36 md:px-10 xl:px-16 lg:pb-48 lg:pt-48">
      <div className="mx-auto max-w-[1240px]">
        <Breadcrumbs items={[{ label: "Blog" }]} />
        <Reveal>
          <SectionHeading
            as="h1"
            title={
              <>
                Informação jurídica <em>em linguagem clara</em>
              </>
            }
            description="Artigos sobre os temas que afetam o dia a dia de pessoas, condomínios e empresas."
          />
        </Reveal>
        <div className="mt-16 lg:mt-24">
          <BlogList posts={ordered} />
        </div>
      </div>
    </div>
  );
}
