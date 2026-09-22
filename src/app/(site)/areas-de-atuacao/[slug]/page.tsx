import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Reveal from "@/components/Reveal";
import AreaCard from "@/components/AreaCard";
import FaqAccordion from "@/components/FaqAccordion";
import ContactAside from "@/components/ContactAside";
import SectionHeading from "@/components/SectionHeading";
import LandingPageView from "@/components/landing/LandingPageView";
import { areas, getArea } from "@/data/areas";
import { getLandingPage } from "@/lib/landing";
import { getFounder } from "@/lib/equipe";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Uma URL, duas fontes: as áreas fixas (src/data/areas.ts, geradas no build)
 * e as landing pages publicadas no painel (Vercel Blob, renderizadas sob
 * demanda e revalidadas a cada alteração). Slugs nunca colidem: o painel
 * reserva os das áreas fixas.
 */
export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = getArea(slug);
  if (area) {
    return pageMetadata({
      title: area.name,
      description: area.metaDescription,
      path: `/areas-de-atuacao/${area.slug}`,
    });
  }
  const page = await getLandingPage(slug);
  if (!page || page.status !== "publicada") return {};
  return pageMetadata({
    title: page.seo.title,
    description: page.seo.description,
    path: `/areas-de-atuacao/${page.slug}`,
    image: page.seo.image ?? page.hero.image?.src,
  });
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const area = getArea(slug);

  if (!area) {
    const page = await getLandingPage(slug);
    if (!page || page.status !== "publicada") notFound();
    return <LandingPageView page={page} founder={await getFounder()} />;
  }

  const outras = areas.filter((a) => a.slug !== area.slug).slice(0, 3);

  return (
    <div className="px-5 pb-28 pt-36 md:px-10 xl:px-16 lg:pb-48 lg:pt-48">
      <div className="mx-auto max-w-[1240px]">
        <Breadcrumbs
          items={[
            { label: "Áreas de Atuação", href: "/areas-de-atuacao" },
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

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-[1fr_360px] lg:gap-20">
          <div className="space-y-16 lg:space-y-20">
            {area.blocks.map((block) => (
              <Reveal key={block.heading}>
                <h2 className="text-title text-ink">
                  {block.heading}
                </h2>
                {block.intro && (
                  <p className="mt-5 max-w-2xl text-lg text-ink-soft">
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
                <h2 className="text-title text-ink">
                  Perguntas frequentes
                </h2>
                <div className="mt-8">
                  <FaqAccordion items={area.faq} />
                </div>
              </Reveal>
            )}
          </div>

          <ContactAside />
        </div>

        <div className="mt-28 lg:mt-44">
          <Reveal>
            <SectionHeading title="Veja também" />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8">
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
