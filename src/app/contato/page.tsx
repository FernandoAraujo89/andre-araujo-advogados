import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";
import { site } from "@/data/site";
import { legalServiceJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contato",
  description:
    "Fale com o André Araújo Advogados em Formiga, MG: WhatsApp (37) 99860-7180, telefone (37) 3322-5265 ou formulário. Rua João Vaz, nº 2, Centro.",
  path: "/contato",
});

const canais = [
  {
    label: "Telefone",
    value: site.phone,
    href: site.phoneHref,
  },
  {
    label: "WhatsApp",
    value: site.whatsapp,
    href: site.whatsappHref,
    external: true,
  },
  {
    label: "E-mail",
    value: site.email,
    href: site.emailHref,
  },
];

export default function ContatoPage() {
  return (
    <div className="px-5 pb-28 pt-36 lg:px-8 lg:pb-36">
      <JsonLd data={legalServiceJsonLd()} />
      <div className="mx-auto max-w-[1240px]">
        <Breadcrumbs items={[{ label: "Contato" }]} />
        <Reveal>
          <SectionHeading
            as="h1"
            title="Vamos conversar sobre o seu caso"
            description="Envie sua mensagem pelo formulário ou fale direto pelos nossos canais. Retornamos o quanto antes."
          />
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="space-y-6">
              {canais.map(({ label, value, href, external }) => (
                <li key={label}>
                  <p className="label text-xs">{label}</p>
                  <a
                    href={href}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="mt-1 inline-block break-all text-lg font-medium text-ink hover:text-wine-deep"
                  >
                    {value}
                  </a>
                </li>
              ))}
              <li>
                <p className="label text-xs">Endereço</p>
                <p className="mt-1 text-lg text-ink">{site.address.full}</p>
              </li>
              <li>
                <p className="label text-xs">Horário de atendimento</p>
                {/* TODO: confirmar horário de atendimento com o escritório */}
                <p className="mt-1 text-lg text-ink">{site.openingHours}</p>
              </li>
            </ul>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-16 overflow-hidden rounded-md border border-line">
            <iframe
              title="Mapa do escritório André Araújo Advogados em Formiga, MG"
              src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapsQuery)}&output=embed`}
              width="100%"
              height="440"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block border-0"
            />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
