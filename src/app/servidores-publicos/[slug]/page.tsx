import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Reveal from "@/components/Reveal";
import AreaIcon from "@/components/AreaIcon";
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
    <div className="px-5 pb-24 pt-32 lg:px-8 lg:pb-32">
      <div className="mx-auto max-w-[1240px]">
        <Breadcrumbs
          items={[
            { label: "Servidores Públicos", href: "/servidores-publicos" },
            { label: page.name },
          ]}
        />

        <Reveal>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper-light text-brass">
            <AreaIcon name={page.icon} className="h-7 w-7" />
          </span>
          <div className="mt-6">
            <SectionHeading
              as="h1"
              eyebrow="Servidores Públicos Estaduais"
              title={page.headline}
            />
          </div>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_360px]">
          <div className="space-y-14">
            {/* O problema */}
            <Reveal>
              <h2 className="font-serif text-2xl font-medium text-ink lg:text-3xl">
                {page.problem.heading}
              </h2>
              <div className="mt-4 max-w-2xl space-y-5">
                {page.problem.paragraphs.map((p, i) => (
                  <p key={i} className="text-lg text-ink-soft">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>

            {/* Como o escritório atua */}
            <Reveal>
              <h2 className="font-serif text-2xl font-medium text-ink lg:text-3xl">
                {page.how.heading}
              </h2>
              <div className="mt-4 max-w-2xl space-y-5">
                {page.how.paragraphs.map((p, i) => (
                  <p key={i} className="text-lg text-ink-soft">
                    {p}
                  </p>
                ))}
              </div>
              <ul className="mt-6 space-y-4">
                {page.how.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check
                      className="mt-1.5 h-4 w-4 shrink-0 text-brass"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <span className="text-ink-soft">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* FAQ */}
            <Reveal>
              <h2 className="font-serif text-2xl font-medium text-ink lg:text-3xl">
                Perguntas frequentes
              </h2>
              <div className="mt-6">
                <FaqAccordion items={page.faq} />
              </div>
            </Reveal>
          </div>

          <ContactAside />
        </div>

        {/* Outros temas do hub */}
        <div className="mt-24">
          <Reveal>
            <SectionHeading eyebrow="Outros temas" title="Também para servidores" />
          </Reveal>
          <ul className="mt-8 flex flex-wrap gap-3">
            {outras.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/servidores-publicos/${p.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-light px-6 py-3 font-medium text-ink transition-colors hover:border-brass hover:text-brass-deep"
                >
                  {p.name}
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
