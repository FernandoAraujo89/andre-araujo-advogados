import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import TeamCard from "@/components/TeamCard";
import { team } from "@/data/team";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Equipe",
  description:
    "Conheça os 13 advogados do André Araújo Advogados em Formiga, MG, liderados por André Augusto de Araújo e Sávio Ribeiro Oliveira.",
  path: "/equipe",
});

export default function EquipePage() {
  return (
    <div className="px-5 pb-28 pt-36 lg:px-8 lg:pb-36">
      <div className="mx-auto max-w-[1240px]">
        <Breadcrumbs items={[{ label: "Equipe" }]} />
        <Reveal>
          <SectionHeading
            as="h1"
            title="As pessoas por trás de cada caso"
            description="Uma equipe de 13 advogados inscritos na OAB/MG, com atuação em sete áreas do direito, a serviço de Formiga e região."
          />
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((lawyer, i) => (
            <Reveal key={lawyer.slug} delay={(i % 4) * 0.06} className="h-full">
              <TeamCard lawyer={lawyer} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
