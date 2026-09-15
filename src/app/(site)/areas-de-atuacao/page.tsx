import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import AreaCard from "@/components/AreaCard";
import { getAreasDeAtuacao } from "@/lib/atuacao";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Áreas de Atuação",
  description:
    "Áreas de atuação do André Araújo Advogados: tributário, condominial, consumidor, imobiliário, empresarial, trabalhista, sucessões, família e servidor público.",
  path: "/areas-de-atuacao",
});

export default async function AreasPage() {
  // As 10 áreas fixas mais as landing pages publicadas no painel.
  const lista = await getAreasDeAtuacao();
  const last = lista.length - 1;

  return (
    <div className="px-5 pb-28 pt-36 md:px-10 xl:px-16 lg:pb-48 lg:pt-48">
      <div className="mx-auto max-w-[1240px]">
        <Breadcrumbs items={[{ label: "Áreas de Atuação" }]} />
        <Reveal>
          <SectionHeading
            as="h1"
            title="Áreas de atuação"
            description="Da consultoria preventiva ao contencioso, para pessoas físicas, condomínios, empresas e servidores públicos, com atendimento em todo o Brasil. Escolha a área que corresponde ao seu caso."
          />
        </Reveal>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3 lg:gap-8">
          {lista.map((area, i) => (
            <Reveal
              key={area.slug}
              delay={(i % 3) * 0.08}
              className={`h-full ${i === last && lista.length % 3 === 1 ? "lg:col-span-3" : ""}`}
            >
              <AreaCard area={area} index={i + 1} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
