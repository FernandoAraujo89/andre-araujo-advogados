import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Reveal from "@/components/Reveal";
import FaqAccordion from "@/components/FaqAccordion";
import ContactAside from "@/components/ContactAside";
import SectionHeading from "@/components/SectionHeading";
import { servidorPages, getServidorPage } from "@/data/servidores";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return servidorPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getServidorPage(slug);
  if (!page) return {};
  return pageMetadata({
    title: `${page.name} do Servidor Estadual`,
    description: page.metaDescription,
    path: `/servidores-publicos/${page.slug}`,
  });
}

export default async function ServidorSubPage({ params }: Props) {
  const { slug } = await params;
  const page = getServidorPage(slug);
  if (!page) notFound();

  const outras = servidorPages.filter((p) => p.slug !== page.slug);

  return (
    <div className="px-5 pb-28 pt-36 md:px-10 xl:px-16 lg:pb-48 lg:pt-48">
      <div className="mx-auto max-w-[1240px]">
        <Breadcrumbs
          items={[
            { label: "Áreas de Atuação", href: "/areas-de-atuacao" },
            { label: "Direito do Servidor Público", href: "/servidores-publicos" },
            { label: page.name },
          ]}
        />

        <Reveal>
          <SectionHeading as="h1" title={page.headline} />
        </Reveal>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-[1fr_360px] lg:gap-20">
          <div className="space-y-16 lg:space-y-20">
            {/* O problema */}
            <Reveal>
              <h2 className="text-title text-ink">
                {page.problem.heading}
              </h2>
              <div className="mt-5 max-w-2xl space-y-5">
                {page.problem.paragraphs.map((p, i) => (
                  <p key={i} className="text-lg text-ink-soft">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>

            {/* Como o escritório atua */}
            <Reveal>
              <h2 className="text-title text-ink">
                {page.how.heading}
              </h2>
              <div className="mt-5 max-w-2xl space-y-5">
                {page.how.paragraphs.map((p, i) => (
                  <p key={i} className="text-lg text-ink-soft">
                    {p}
                  </p>
                ))}
              </div>
              <ul className="mt-6 list-disc space-y-3 pl-5 marker:text-accent">
                {page.how.items.map((item) => (
                  <li key={item} className="text-ink-soft">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* FAQ */}
            <Reveal>
              <h2 className="text-title text-ink">
                Perguntas frequentes
              </h2>
              <div className="mt-8">
                <FaqAccordion items={page.faq} />
              </div>
            </Reveal>
          </div>

          <ContactAside />
        </div>

        {/* Outros temas do hub */}
        <div className="mt-28 lg:mt-44">
          <Reveal>
            <SectionHeading title="Também para servidores" />
          </Reveal>
          <ul className="mt-10 flex flex-wrap gap-3 lg:mt-12">
            {outras.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/servidores-publicos/${p.slug}`}
                  className="inline-block rounded-sm border border-line bg-paper-light px-6 py-3 font-medium text-ink transition-colors hover:border-accent hover:text-accent-deep"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
