import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import FaqAccordion from "@/components/FaqAccordion";
import JsonLd from "@/components/JsonLd";
import { faqGroups } from "@/data/faq";
import { faqPageJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Perguntas Frequentes",
  description:
    "Dúvidas frequentes sobre atendimento, áreas de atuação e direitos de servidores públicos no André Araújo Advogados.",
  path: "/faq",
});

export default function FaqPage() {
  const allItems = faqGroups.flatMap((g) => g.items);

  return (
    <div className="px-5 pb-28 pt-36 md:px-10 xl:px-16 lg:pb-48 lg:pt-48">
      <JsonLd data={faqPageJsonLd(allItems)} />
      <div className="mx-auto max-w-[1240px]">
        <Breadcrumbs items={[{ label: "Perguntas Frequentes" }]} />
        <Reveal>
          <SectionHeading
            as="h1"
            title="Perguntas frequentes"
            description="Reunimos as dúvidas mais comuns de quem procura o escritório. Não encontrou a sua? Fale conosco pelo WhatsApp ou pela página de contato."
          />
        </Reveal>

        <div className="mx-auto mt-16 max-w-3xl space-y-16 lg:mt-24 lg:space-y-20">
          {faqGroups.map((group) => (
            <Reveal key={group.theme}>
              <h2 className="mb-6 text-title text-ink">
                {group.theme}
              </h2>
              <FaqAccordion items={group.items} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
