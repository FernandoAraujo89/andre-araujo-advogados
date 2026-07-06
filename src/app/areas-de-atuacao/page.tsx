import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import AreaCard from "@/components/AreaCard";
import { areas } from "@/data/areas";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Áreas de Atuação",
  description:
    "Áreas de atuação do André Araújo Advogados em Formiga, MG: tributário, condominial, consumidor, imobiliário, empresarial, trabalhista e crédito.",
  path: "/areas-de-atuacao",
});

export default function AreasPage() {
  return (
    <div className="px-5 pb-24 pt-32 lg:px-8 lg:pb-32">
      <div className="mx-auto max-w-[1240px]">
        <Breadcrumbs items={[{ label: "Áreas de Atuação" }]} />
        <Reveal>
          <SectionHeading
            as="h1"
            eyebrow="Áreas de Atuação"
            title="Sete áreas para resolver a sua questão"
            description="Da consultoria preventiva ao contencioso, o escritório atende pessoas físicas, condomínios e empresas de Formiga e região."
          />
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area, i) => (
            <Reveal key={area.slug} delay={(i % 3) * 0.08} className="h-full">
              <AreaCard area={area} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
