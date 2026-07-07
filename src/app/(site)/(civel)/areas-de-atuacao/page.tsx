import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import AreaCard from "@/components/AreaCard";
import { areas } from "@/data/areas";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Direito Cível e Empresarial",
  description:
    "Direito Cível e Empresarial no André Araújo Advogados, Formiga, MG: tributário, condominial, consumidor, imobiliário, empresarial, trabalhista e crédito.",
  path: "/areas-de-atuacao",
});

export default function AreasPage() {
  return (
    <div className="px-5 pb-28 pt-36 lg:px-8 lg:pb-36">
      <div className="mx-auto max-w-[1240px]">
        <Breadcrumbs items={[{ label: "Direito Cível e Empresarial" }]} />
        <Reveal>
          <SectionHeading
            as="h1"
            title="Direito Cível e Empresarial"
            description={`A vertente cível e empresarial do escritório reúne ${areas.length} áreas, da consultoria preventiva ao contencioso, para pessoas físicas, condomínios e empresas de Formiga e região.`}
          />
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area, i) => (
            <Reveal key={area.slug} delay={(i % 3) * 0.08} className="h-full">
              <AreaCard area={area} index={i + 1} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
