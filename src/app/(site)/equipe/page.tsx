import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import TeamCard from "@/components/TeamCard";
import Photo from "@/components/Photo";
import { groupBySetor } from "@/data/team";
import { getTeam } from "@/lib/equipe";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Equipe",
  description:
    "Conheça a equipe do André Araújo Advogados, liderada pelo sócio fundador André Augusto de Araújo (OAB/MG 142.853).",
  path: "/equipe",
});

// Lê a equipe do Blob a cada requisição: incluir, editar, remover ou reordenar
// no painel reflete no ar na hora. Segue SSR (SEO completo).
export const dynamic = "force-dynamic";

export default async function EquipePage() {
  const grupos = groupBySetor(await getTeam());

  return (
    <div className="px-5 pb-28 pt-36 md:px-10 xl:px-16 lg:pb-48 lg:pt-48">
      <div className="mx-auto max-w-[1240px]">
        <Breadcrumbs items={[{ label: "Equipe" }]} />
        <Reveal>
          <SectionHeading
            as="h1"
            title={
              <>
                As pessoas <em>por trás de cada caso</em>
              </>
            }
            description="Uma equipe de profissionais qualificados (advocacia, controladoria jurídica, estágio e atendimento) liderada pelo sócio fundador André Augusto de Araújo."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <Photo
            src="/images/escritorio/equipe-estudio.jpg"
            alt="A equipe do André Araújo Advogados reunida em estúdio"
            ratio="16/9"
            sizes="(max-width: 1304px) 100vw, 1240px"
            objectPosition="center 35%"
            className="mt-16 lg:mt-24"
          />
        </Reveal>

        {grupos.map(({ setor, members }) => (
          <section key={setor || "sem-setor"} className="mt-16 lg:mt-24">
            {setor && (
              <Reveal>
                <h2 className="border-b border-line pb-4 font-serif text-2xl italic text-accent">
                  {setor}
                </h2>
              </Reveal>
            )}
            <div
              className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 ${
                setor ? "mt-10" : ""
              }`}
            >
              {members.map((member, i) => (
                <Reveal
                  key={member.slug}
                  delay={(i % 4) * 0.06}
                  className="h-full"
                >
                  <TeamCard member={member} />
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
