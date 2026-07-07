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

/**
 * Mosaico da galeria — linhas de alturas casadas na grade de 12 colunas
 * (gap-8, container 1240px): 8/1.6 ≈ 4/(10/13), pares 6+6 com proporção
 * idêntica. As fotos falam por si — sem legendas.
 */
const fotos: {
  src: string;
  alt: string;
  ratio: string;
  span: string;
  sizes: string;
  delay: number;
}[] = [
  // Linha 1 — a chegada: fachada + sala de espera
  {
    src: "/images/escritorio/fachada.jpg",
    alt: "Placa vermelha com o logotipo dourado do escritório na fachada, contra o céu azul",
    ratio: "16/10",
    span: "lg:col-span-8",
    sizes: "(max-width: 1024px) 100vw, (max-width: 1304px) 66vw, 816px",
    delay: 0,
  },
  {
    src: "/images/escritorio/espera.jpg",
    alt: "Duas poltronas na sala de espera, sob quadros em preto e branco de Formiga",
    ratio: "10/13",
    span: "lg:col-span-4",
    sizes: "(max-width: 1024px) 100vw, (max-width: 1304px) 33vw, 392px",
    delay: 0.12,
  },
  // Linha 2 — a recepção (espelhada)
  {
    src: "/images/escritorio/recepcao.jpg",
    alt: "Balcão da recepção com espelho bronze, logotipo do escritório e pendentes de filamento",
    ratio: "10/13",
    span: "lg:col-span-4",
    sizes: "(max-width: 1024px) 100vw, (max-width: 1304px) 33vw, 392px",
    delay: 0,
  },
  {
    src: "/images/escritorio/atendimento.jpg",
    alt: "Advogado cumprimenta visitante com aperto de mãos sobre a mesa de atendimento",
    ratio: "16/10",
    span: "lg:col-span-8",
    sizes: "(max-width: 1024px) 100vw, (max-width: 1304px) 66vw, 816px",
    delay: 0.12,
  },
  // Linha 3 — panorâmica central
  {
    src: "/images/escritorio/reuniao-clientes.jpg",
    alt: "Equipe reunida na sala de reuniões, com parede de cobogós ao fundo",
    ratio: "2/1",
    span: "lg:col-span-12",
    sizes: "(max-width: 1024px) 100vw, 1200px",
    delay: 0,
  },
  // Linha 4 — as salas (proporção nativa 3/2, sem corte)
  {
    src: "/images/escritorio/sala-de-reunioes.jpg",
    alt: "Cadeiras pretas em volta da mesa da sala de reuniões, com o logotipo na janela",
    ratio: "3/2",
    span: "lg:col-span-6",
    sizes: "(max-width: 1024px) 100vw, (max-width: 1304px) 50vw, 604px",
    delay: 0,
  },
  {
    src: "/images/escritorio/sala-de-reunioes-mesa.jpg",
    alt: "Sala de reuniões com mesa branca, painel preto e televisão",
    ratio: "3/2",
    span: "lg:col-span-6",
    sizes: "(max-width: 1024px) 100vw, (max-width: 1304px) 50vw, 604px",
    delay: 0.12,
  },
  // Linha 5 — reuniões em andamento
  {
    src: "/images/escritorio/reuniao-apresentacao.jpg",
    alt: "Advogado aponta para documento exibido na televisão durante reunião",
    ratio: "3/2",
    span: "lg:col-span-6",
    sizes: "(max-width: 1024px) 100vw, (max-width: 1304px) 50vw, 604px",
    delay: 0,
  },
  {
    src: "/images/escritorio/reuniao-tv.jpg",
    alt: "Participantes à mesa, diante da televisão com a marca do escritório",
    ratio: "3/2",
    span: "lg:col-span-6",
    sizes: "(max-width: 1024px) 100vw, (max-width: 1304px) 50vw, 604px",
    delay: 0.12,
  },
  // Linha 6 — a equipe em produção
  {
    src: "/images/escritorio/equipe-estacoes.jpg",
    alt: "Integrantes da equipe trabalham nas estações, sob o logotipo dourado",
    ratio: "16/10",
    span: "lg:col-span-6",
    sizes: "(max-width: 1024px) 100vw, (max-width: 1304px) 50vw, 604px",
    delay: 0,
  },
  {
    src: "/images/escritorio/equipe-bastidores.jpg",
    alt: "Equipe trabalhando em computadores na sala interna do escritório",
    ratio: "16/10",
    span: "lg:col-span-6",
    sizes: "(max-width: 1024px) 100vw, (max-width: 1304px) 50vw, 604px",
    delay: 0.12,
  },
];

export default function OEscritorioPage() {
  return (
    <>
      {/* 1. Hero — papel */}
      <section className="px-5 pb-24 pt-36 lg:px-8">
        <div className="mx-auto max-w-[1240px]">
          <Breadcrumbs items={[{ label: "O Escritório" }]} />

          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <Reveal>
              <h1 className="text-balance font-serif text-[clamp(2.5rem,4.5vw,4.25rem)] font-medium leading-[1.05] tracking-[-0.015em] text-ink">
                Advocacia com endereço,{" "}
                <em className="italic text-accent">rosto e história</em>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-pretty text-ink-soft">
                O André Araújo Advogados nasceu em Formiga, MG, com a convicção
                de que a boa advocacia se faz com técnica e com vínculo:
                conhecer o cliente, a cidade e o contexto de cada caso.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <Photo
                src="/images/escritorio/letreiro.jpg"
                alt="Letreiro dourado do André Araújo Advogados aplicado ao espelho da recepção, com luminárias de filamento"
                ratio="4/3"
                preload
                sizes="(max-width: 1024px) 100vw, (max-width: 1304px) 45vw, 568px"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2. História — faixa paper-light, como a seção de áreas da home */}
      <section className="border-y border-line bg-paper-light px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-12 lg:grid-cols-2">
            <Reveal>
              <SectionHeading title="De Formiga, para toda a região" />
            </Reveal>
            <Reveal delay={0.1}>
              <div className="space-y-5 text-lg text-ink-soft">
                {/* TODO: revisar marcos da história com o cliente */}
                <p>
                  Há sete anos, André Augusto de Araújo fundou o escritório com
                  o propósito de oferecer, em Formiga e no centro-oeste de Minas
                  Gerais, uma advocacia completa para pessoas físicas,
                  condomínios e empresas, sem que fosse preciso buscar nos
                  grandes centros o suporte jurídico de qualidade.
                </p>
                <p>
                  Hoje, o escritório reúne 12 profissionais (advocacia,
                  controladoria jurídica, estágio e atendimento) com a atuação
                  organizada em duas vertentes: o Direito Cível e Empresarial,
                  que abrange diversas áreas do direito privado, e o Direito do
                  Servidor Público, dedicado aos servidores estaduais de Minas
                  Gerais. O
                  crescimento veio da forma que o escritório mais valoriza: pela
                  indicação de quem já confiou seu caso a nós.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. Missão — faixa vinho, citação centrada */}
      <section className="bg-accent-surface px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <figure className="mx-auto max-w-4xl text-center">
              <blockquote className="text-balance font-serif text-[clamp(1.5rem,3vw,2.25rem)] font-normal leading-[1.35] text-paper-light">
                “Prestar serviços jurídicos que ultrapassem a esfera da
                excelência profissional, mediante a valorização dos laços
                criados com os clientes, a fim de desenvolver parcerias
                consistentes e perduráveis.”
              </blockquote>
              <figcaption className="mt-6 text-base text-paper/85">
                Missão do escritório
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* 4. Valores — papel */}
      <section className="px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-[1240px]">
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
      </section>

      {/* 5. Galeria — faixa escura; as fotos falam por si, sem legendas */}
      <section className="bg-ink px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <SectionHeading dark title="A sede, em Formiga" />
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            {fotos.map((foto) => (
              <Reveal key={foto.src} delay={foto.delay} className={foto.span}>
                <Photo
                  src={foto.src}
                  alt={foto.alt}
                  ratio={foto.ratio}
                  sizes={foto.sizes}
                />
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      {/* 6. CTA — faixa rosada entre a galeria escura e o rodapé escuro */}
      <section className="bg-accent-mist px-5 py-24 text-center lg:px-8 lg:py-32">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <h2 className="text-balance mx-auto max-w-2xl font-serif text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.1] text-ink">
              Conheça o escritório de perto
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
              Agende um atendimento e converse com a nossa equipe sobre o seu
              caso.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href={site.whatsappHref} external size="lg">
                Falar no WhatsApp
              </Button>
              <Button href="/contato" variant="secondary" size="lg">
                Agendar atendimento
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
