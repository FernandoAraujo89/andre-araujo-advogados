import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import Photo from "@/components/Photo";
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
    <div className="px-5 pb-28 pt-36 lg:px-8 lg:pb-36">
      <div className="mx-auto max-w-[1240px]">
        <Breadcrumbs items={[{ label: "O Escritório" }]} />

        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <SectionHeading
              as="h1"
              title="Advocacia feita de perto, para quem confia de perto"
              description="O André Araújo Advogados nasceu em Formiga, MG, com a convicção de que a boa advocacia se faz com técnica e com vínculo: conhecer o cliente, a cidade e o contexto de cada caso."
            />
          </Reveal>
          <Reveal delay={0.15}>
            {/* TODO: substituir pela foto real da fachada ou recepção do escritório */}
            <Photo
              src="https://images.unsplash.com/photo-1571624436279-b272aff752b5?auto=format&fit=crop&w=1400&q=80"
              alt="Sala de reunião com mesa de madeira e cadeiras"
              ratio="4/3"
              credit="Foto: S O C I A L . C U T / Unsplash"
              creditUrl="https://unsplash.com/@socialcut?utm_source=site_andre_araujo&utm_medium=referral"
            />
          </Reveal>
        </div>

        {/* História */}
        <div className="mt-24 grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading title="De Formiga, para toda a região" />
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
                Hoje, a equipe reúne 13 advogados inscritos na OAB/MG, com a
                atuação organizada em duas vertentes: o Direito Cível e
                Empresarial, que abrange sete áreas, e o Direito do Servidor
                Público, dedicado aos servidores estaduais de Minas Gerais. O
                crescimento veio da forma que o escritório mais valoriza: pela
                indicação de quem já confiou seu caso a nós.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Missão — bloco de citação em serif */}
        <Reveal>
          <figure className="mx-auto mt-24 max-w-4xl border-l-2 border-wine py-4 pl-8 lg:pl-12">
            <blockquote className="font-serif text-[clamp(1.5rem,3vw,2.25rem)] font-normal leading-[1.35] text-ink">
              “Prestar serviços jurídicos que ultrapassem a esfera da
              excelência profissional, mediante a valorização dos laços criados
              com os clientes, a fim de desenvolver parcerias consistentes e
              perduráveis.”
            </blockquote>
            <figcaption className="mt-6 text-sm text-ink-soft">
              Missão do escritório
            </figcaption>
          </figure>
        </Reveal>

        {/* Valores */}
        <div className="mt-24">
          <Reveal>
            <SectionHeading title="O que orienta a nossa prática" />
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valores.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08} className="h-full">
                <div className="h-full rounded-md border border-line bg-paper-light p-8">
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
          <div className="mt-24 rounded-md bg-ink px-6 py-16 text-center lg:px-16">
            <h2 className="mx-auto max-w-2xl font-serif text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.1] text-paper-light">
              Conheça o escritório de perto
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-paper/75">
              Agende um atendimento e converse com a nossa equipe sobre o seu
              caso.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href={site.whatsappHref} external variant="light" size="lg">
                Falar no WhatsApp
              </Button>
              <Button
                href="/contato"
                size="lg"
                className="border border-paper/40 bg-transparent text-paper-light hover:border-paper-light hover:bg-paper/10"
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
