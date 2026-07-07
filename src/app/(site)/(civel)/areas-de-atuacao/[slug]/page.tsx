import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Reveal from "@/components/Reveal";
import AreaCard from "@/components/AreaCard";
import FaqAccordion from "@/components/FaqAccordion";
import ContactAside from "@/components/ContactAside";
import SectionHeading from "@/components/SectionHeading";
import { areas, getArea } from "@/data/areas";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) return {};
  return pageMetadata({
    title: `${area.name} em Formiga, MG`,
    description: area.metaDescription,
    path: `/areas-de-atuacao/${area.slug}`,
  });
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) notFound();

  const outras = areas.filter((a) => a.slug !== area.slug).slice(0, 3);

  return (
    <div className="px-5 pb-28 pt-36 lg:px-8 lg:pb-36">
      <div className="mx-auto max-w-[1240px]">
        <Breadcrumbs
          items={[
            { label: "Direito Cível e Empresarial", href: "/areas-de-atuacao" },
            { label: area.name },
          ]}
        />

        <Reveal>
          <SectionHeading
            as="h1"
            title={area.name}
            description={area.intro}
          />
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_360px]">
          <div className="space-y-14">
            {area.blocks.map((block) => (
              <Reveal key={block.heading}>
                <h2 className="font-serif text-2xl font-medium text-ink lg:text-3xl">
                  {block.heading}
                </h2>
                {block.intro && (
                  <p className="mt-4 max-w-2xl text-lg text-ink-soft">
                    {block.intro}
                  </p>
                )}
                {block.items && (
                  <ul className="mt-6 list-disc space-y-3 pl-5 marker:text-accent">
                    {block.items.map((item) => (
                      <li key={item} className="text-ink-soft">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            ))}

            {area.faq.length > 0 && (
              <Reveal>
                <h2 className="font-serif text-2xl font-medium text-ink lg:text-3xl">
                  Perguntas frequentes
                </h2>
                <div className="mt-6">
                  <FaqAccordion items={area.faq} />
                </div>
              </Reveal>
            )}
          </div>

          <ContactAside />
        </div>

        <div className="mt-24">
          <Reveal>
            <SectionHeading title="Veja também" />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {outras.map((a, i) => (
              <Reveal key={a.slug} delay={i * 0.08} className="h-full">
                <AreaCard area={a} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
