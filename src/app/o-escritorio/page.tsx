import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import PhotoPlaceholder from "@/components/PhotoPlaceholder";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "O Escritório",
  description:
    "Conheça o André Araújo Advogados: história, missão e valores do escritório de advocacia em Formiga, MG, a serviço de empresas e famílias da região.",
  path: "/o-escritorio",
});

const valores = [
  {
    title: "Proximidade",
    text: "Relações de confiança se constroem no atendimento direto, olho no olho, com quem conhece a realidade da região.",
  },
  {
    title: "Excelência técnica",
    text: "Estudo constante e rigor na condução de cada caso, da consulta inicial à última manifestação.",
  },
  {
    title: "Transparência",
    text: "O cliente sabe o que está acontecendo no seu caso, quais são as possibilidades reais e os custos envolvidos.",
  },
  {
    title: "Compromisso com a região",
    text: "Um escritório de Formiga que cresce junto com as pessoas e as empresas do centro-oeste mineiro.",
  },
];

export default function OEscritorioPage() {
  return (
    <div className="px-5 pb-24 pt-32 lg:px-8 lg:pb-32">
      <div className="mx-auto max-w-[1240px]">
        <Breadcrumbs items={[{ label: "O Escritório" }]} />

        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="O Escritório"
              title="Advocacia feita de perto, para quem confia de perto"
              description="O André Araújo Advogados nasceu em Formiga, MG, com a convicção de que a boa advocacia se faz com técnica e com vínculo: conhecer o cliente, a cidade e o contexto de cada caso."
            />
          </Reveal>
          <Reveal delay={0.15}>
            {/* TODO: substituir pela foto real da fachada ou recepção do escritório */}
            <PhotoPlaceholder
              label="Foto real do escritório (fachada ou recepção)"
              ratio="4/3"
            />
          </Reveal>
        </div>

        {/* História */}
        <div className="mt-24 grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading eyebrow="Nossa história" title="De Formiga, para toda a região" />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-5 text-lg text-ink-soft">
              {/* TODO: revisar a história com o cliente (ano de fundação, marcos) */}
              <p>
                O escritório foi fundado por André Augusto de Araújo com o
                propósito de oferecer, em Formiga e no centro-oeste de Minas
                Gerais, uma advocacia completa para pessoas físicas, condomínios
                e empresas — sem que fosse preciso buscar nos grandes centros o
                suporte jurídico de qualidade.
              </p>
              <p>
                Hoje, a equipe reúne 13 advogados inscritos na OAB/MG e atua em
                sete áreas do direito, além de uma frente dedicada aos
                servidores públicos estaduais. O crescimento veio da forma que
                o escritório mais valoriza: pela indicação de quem já confiou
                seu caso a nós.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Missão — bloco de citação em serif */}
        <Reveal>
          <figure className="mx-auto mt-24 max-w-4xl border-l-2 border-brass py-4 pl-8 lg:pl-12">
            <blockquote className="font-serif text-[clamp(1.5rem,3vw,2.25rem)] font-normal leading-[1.35] text-ink">
              “Prestar serviços jurídicos que ultrapassem a esfera da
              excelência profissional, mediante a valorização dos laços criados
              com os clientes, a fim de desenvolver parcerias consistentes e
              perduráveis.”
            </blockquote>
            <figcaption className="eyebrow mt-6">
              Missão do escritório
            </figcaption>
          </figure>
        </Reveal>

        {/* Valores */}
        <div className="mt-24">
          <Reveal>
            <SectionHeading eyebrow="Valores" title="O que orienta a nossa prática" />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valores.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08} className="h-full">
                <div className="h-full rounded-[1.75rem] border border-line bg-paper-light p-8">
                  <h3 className="font-serif text-xl font-medium text-ink">
                    {v.title}
                  </h3>
                  <p className="mt-3 text-[0.9375rem] text-ink-soft">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* CTA final */}
        <Reveal>
          <div className="mt-24 rounded-[2rem] bg-ink px-6 py-16 text-center lg:px-16">
            <h2 className="mx-auto max-w-2xl font-serif text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.1] text-paper-light">
              Conheça o escritório de perto
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-paper/75">
              Agende um atendimento e converse com a nossa equipe sobre o seu
              caso.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href={site.whatsappHref} external variant="light" size="lg">
                <MessageCircle className="h-4 w-4 text-brass" strokeWidth={1.5} aria-hidden />
                Falar no WhatsApp
              </Button>
              <Button
                href="/contato"
                size="lg"
                className="border border-paper/30 bg-transparent text-paper-light hover:bg-transparent hover:text-brass"
              >
                Agendar atendimento
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
