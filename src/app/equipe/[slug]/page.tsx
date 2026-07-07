import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import Photo from "@/components/Photo";
import PhotoPlaceholder from "@/components/PhotoPlaceholder";
import { team, getLawyer, initialsOf } from "@/data/team";
import { getArea } from "@/data/areas";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return team.filter((m) => m.hasProfile).map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lawyer = getLawyer(slug);
  if (!lawyer) return {};
  return pageMetadata({
    title: lawyer.name,
    description: `${lawyer.name}, ${lawyer.role.toLowerCase()} do André Araújo Advogados, escritório de advocacia em Formiga, MG.`,
    path: `/equipe/${lawyer.slug}`,
  });
}

export default async function LawyerPage({ params }: Props) {
  const { slug } = await params;
  const lawyer = getLawyer(slug);
  if (!lawyer) notFound();

  const lawyerAreas = (lawyer.areas ?? [])
    .map((s) => getArea(s))
    .filter((a) => a !== undefined);

  return (
    <div className="px-5 pb-28 pt-36 lg:px-8 lg:pb-36">
      <div className="mx-auto max-w-[1240px]">
        <Breadcrumbs
          items={[{ label: "Equipe", href: "/equipe" }, { label: lawyer.name }]}
        />

        <div className="grid gap-12 lg:grid-cols-[380px_1fr]">
          <Reveal>
            {lawyer.photo ? (
              <Photo
                src={lawyer.photo}
                alt={`Foto de ${lawyer.name}`}
                ratio="1/1"
                sizes="(max-width: 1024px) 100vw, 380px"
                preload
              />
            ) : (
              <PhotoPlaceholder
                label={`Foto de ${lawyer.name}`}
                initials={initialsOf(lawyer.name)}
                ratio="1/1"
              />
            )}
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="font-serif text-[clamp(2.25rem,4.5vw,3.5rem)] font-medium leading-[1.1] text-ink">
              {lawyer.name}
            </h1>
            <p className="mt-3 text-ink-soft">
              {[lawyer.role, lawyer.oab].filter(Boolean).join(" — ")}
            </p>
            <p className="mt-8 max-w-2xl text-lg text-ink-soft">{lawyer.bio}</p>

            {lawyerAreas.length > 0 && (
              <div className="mt-10">
                <h2 className="text-base font-medium text-ink-soft">
                  Áreas em que atua
                </h2>
                <ul className="mt-4 flex flex-wrap gap-3">
                  {lawyerAreas.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={`/areas-de-atuacao/${a.slug}`}
                        className="inline-block rounded-sm border border-line bg-paper-light px-5 py-2.5 text-[0.9375rem] font-medium text-ink transition-colors hover:border-wine hover:text-wine-deep"
                      >
                        {a.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-4">
              <Button href={site.whatsappHref} external size="lg">
                Falar no WhatsApp
              </Button>
              <Button href="/contato" variant="secondary" size="lg">
                Agendar atendimento
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
