import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import AreaCard from "@/components/AreaCard";
import PostCard from "@/components/PostCard";
import StatCounter from "@/components/StatCounter";
import GoogleReviews from "@/components/GoogleReviews";
import ParallaxBackdrop from "@/components/ParallaxBackdrop";
import ContactForm from "@/components/ContactForm";
import Photo from "@/components/Photo";
import JsonLd from "@/components/JsonLd";
import { site, stats } from "@/data/site";
import { areasDeAtuacao } from "@/data/atuacao";
import { team } from "@/data/team";
import { getAllPosts } from "@/lib/blog";
import { legalServiceJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "André Araújo Advogados | Advocacia em todo o Brasil",
  description: site.description,
  path: "/",
});

// A home é estática, mas revalida a cada 5 min para refletir os posts mais
// recentes do blog (a seção de destaques lê do Blob).
export const revalidate = 300;

const diferenciais = [
  {
    title: "Atendimento próximo, onde você estiver",
    text: "Presencial na sede ou remoto, em todo o Brasil. Você fala com quem conduz o seu caso.",
  },
  {
    title: "Transparência em cada etapa",
    text: "Você acompanha o andamento do seu caso e sabe o que esperar de cada fase.",
  },
  {
    title: "Comunicação acessível",
    text: "Explicamos o seu caso em linguagem clara, sem juridiquês.",
  },
  {
    title: "Atuação preventiva e contenciosa",
    text: "Prevenimos problemas antes que aconteçam e defendemos seus interesses quando necessário.",
  },
];

export default async function Home() {
  const [andre] = team;
  const recentPosts = (await getAllPosts()).slice(0, 3);

  return (
    <>
      <JsonLd data={legalServiceJsonLd()} />

      {/* 1. Hero — fundo azul-tinta, ocupa a viewport; a barra de
          credibilidade fica no rodapé do próprio hero */}
      <section className="flex min-h-svh flex-col bg-ink px-5 pb-8 pt-28 md:px-10 xl:px-16 lg:pb-10 lg:pt-32">
        <div className="mx-auto flex w-full max-w-[1240px] flex-1 items-center">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
            <Reveal>
              {/* Corpo e margens do hero não crescem como nas outras seções
                  (nada de text-display): título, texto e botões precisam caber
                  na viewport junto com a barra de números, inclusive em 1366x768 */}
              <h1 className="text-balance text-[clamp(2.5rem,4.5vw,4.25rem)] leading-[1.05] tracking-[-0.035em] text-paper-light">
                Advocacia especializada, com atendimento{" "}
                <em className="text-gold">em todo o Brasil</em>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-pretty text-paper/75">
                Direito cível, empresarial, tributário e do servidor público.
                O escritório atende pessoas, empresas e servidores de forma
                presencial ou remota, com a mesma atenção em cada caso.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Button href={site.whatsappHref} external variant="light" size="lg">
                  Falar no WhatsApp
                </Button>
                <Button href="/areas-de-atuacao" variant="ghost-light" size="lg">
                  Ver áreas de atuação
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.15} className="hidden lg:block">
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute -bottom-5 -right-5 h-full w-full rounded-md bg-gold/25"
                />
                <Photo
                  src="/images/escritorio/fachada.jpg"
                  alt="Fachada do escritório André Araújo Advogados, com a placa e o logotipo"
                  ratio="4/5"
                  preload
                  sizes="(max-width: 1024px) 0px, 45vw"
                  className="max-h-[calc(100svh-20rem)]"
                  objectPosition="60% center"
                />
              </div>
            </Reveal>
          </div>
        </div>

        {/* Barra de credibilidade — dentro da viewport do hero */}
        <div
          aria-label="Números do escritório"
          className="mx-auto w-full max-w-[1240px] border-t border-paper/15 pt-8 lg:pt-10"
        >
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-paper/15 lg:[&>*]:px-10 lg:[&>*:first-child]:pl-0">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.08}>
                <StatCounter
                  value={"display" in stat ? null : stat.value}
                  display={"display" in stat ? stat.display : undefined}
                  suffix={stat.suffix}
                  label={stat.label}
                  href={"href" in stat ? stat.href : undefined}
                  linkLabel={"linkLabel" in stat ? stat.linkLabel : undefined}
                  dark
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Áreas de atuação — o cliente escolhe o caminho do seu caso */}
      <section className="border-b border-line bg-paper-light px-5 py-24 md:px-10 xl:px-16 lg:py-44">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                title="Áreas de atuação"
                description="Escolha a área que corresponde ao seu caso. São dez frentes de trabalho, do direito cível e empresarial ao direito do servidor público."
              />
              <Link
                href="/areas-de-atuacao"
                className="font-medium text-accent-deep transition-colors hover:text-accent"
              >
                Ver todas as áreas
              </Link>
            </div>
          </Reveal>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3 lg:gap-8">
            {areasDeAtuacao.map((area, i) => (
              <Reveal
                key={area.slug}
                delay={(i % 3) * 0.08}
                className={`h-full ${
                  i === areasDeAtuacao.length - 1 ? "lg:col-span-3" : ""
                }`}
              >
                <AreaCard area={area} index={i + 1} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Por que o André Araújo Advogados — portal para O Escritório:
          foto da sede em multiply escuro com parallax no scroll */}
      <section className="relative isolate overflow-hidden bg-ink px-5 py-24 md:px-10 xl:px-16 lg:py-44">
        <ParallaxBackdrop src="/images/escritorio/sala-de-reunioes.jpg" />

        <div className="relative z-10 mx-auto max-w-[1240px]">
          <Reveal>
            <p className="mb-6 text-sm font-medium uppercase tracking-[0.18em] text-gold">
              O escritório
            </p>
            <SectionHeading
              dark
              title={
                <>
                  Advocacia de confiança, <em>do jeito que deveria ser</em>
                </>
              }
            />
          </Reveal>
          <div className="mt-16 grid gap-x-12 gap-y-14 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
            {diferenciais.map(({ title, text }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <p
                  aria-hidden
                  className="font-serif text-lg italic text-paper/50"
                >
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 border-t border-paper/25 pt-5 text-card text-paper-light">
                  {title}
                </h3>
                <p className="mt-4 text-[0.9375rem] text-paper/80">{text}</p>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-16 flex flex-col items-start gap-6 border-t border-paper/15 pt-10 sm:flex-row sm:items-center sm:justify-between lg:mt-24 lg:pt-12">
              <p className="max-w-md text-lg text-pretty text-paper/85">
                Conheça nossa história, a estrutura e a equipe. Veja as fotos da
                sede.
              </p>
              <Button
                href="/o-escritorio"
                variant="light"
                size="lg"
                className="shrink-0"
              >
                Conhecer o escritório
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3.75 9h10.5M9.75 4.5 14.25 9l-4.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. Equipe — André em destaque com resumo do currículo */}
      <section className="px-5 py-24 md:px-10 xl:px-16 lg:py-44">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <SectionHeading
              title={
                <>
                  Quem conduz <em>o seu caso</em>
                </>
              }
              description="O escritório é liderado pelo sócio fundador André Augusto de Araújo, à frente de uma equipe de profissionais qualificados em advocacia, controladoria jurídica e atendimento."
            />
          </Reveal>
          <div className="mt-16 grid items-center gap-12 lg:mt-24 lg:grid-cols-[380px_1fr] lg:gap-24">
            <Reveal>
              <Photo
                src={andre.photo!}
                alt={`Foto de ${andre.name}`}
                ratio="1/1"
                sizes="(max-width: 1024px) 100vw, 380px"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="text-title text-ink">
                {andre.name}
              </h3>
              <p className="mt-3 text-ink-soft">
                {andre.role}, {andre.oab}
              </p>
              <p className="mt-8 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-soft">
                Graduado em Direito pelo UNIFOR-MG, com pós-graduações em
                Direito Empresarial e Advocacia Empresarial e em Direito
                Tributário (Anhanguera Uniderp) e em Advocacia Tributária
                (FUMEC), é pós-graduando em Direito Tributário pelo IBET e
                membro da ABRADT. Soma mais de 12 anos de advocacia preventiva,
                consultiva e contenciosa nas áreas cível, empresarial,
                trabalhista e tributária.
              </p>
              <div className="mt-10">
                <Button href="/equipe" variant="secondary">
                  Conheça toda a equipe
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. Avaliações do Google — prova social */}
      <GoogleReviews />

      {/* 6. Blog — fundo em tom claro do acento (accent-mist) */}
      <section className="border-y border-line bg-accent-mist px-5 py-24 md:px-10 xl:px-16 lg:py-44">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                title={
                  <>
                    Informação jurídica <em>em linguagem clara</em>
                  </>
                }
              />
              <Button href="/blog" variant="secondary">
                Ver todos os artigos
              </Button>
            </div>
          </Reveal>
          <div className="mt-16 grid gap-6 md:grid-cols-3 lg:mt-24 lg:gap-8">
            {recentPosts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.08} className="h-full">
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Contato — canais diretos; endereço e mapa só na página de Contato */}
      <section className="px-5 pb-28 pt-24 md:px-10 xl:px-16 lg:pb-48 lg:pt-44">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <SectionHeading
              title={
                <>
                  Vamos conversar <em>sobre o seu caso</em>
                </>
              }
              description="Envie sua mensagem ou fale direto pelos nossos canais. Retornamos o quanto antes."
            />
          </Reveal>
          <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-2 lg:gap-24">
            <Reveal>
              <ContactForm />
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="space-y-8 text-ink">
                <li>
                  <p className="label">Telefone</p>
                  <a href={site.phoneHref} className="mt-1 inline-block text-lg font-medium hover:text-accent-deep">
                    {site.phone}
                  </a>
                </li>
                <li>
                  <p className="label">WhatsApp</p>
                  <a
                    href={site.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-lg font-medium hover:text-accent-deep"
                  >
                    {site.whatsapp}
                  </a>
                </li>
                <li>
                  <p className="label">E-mail</p>
                  <a href={site.emailHref} className="mt-1 inline-block text-lg font-medium break-words hover:text-accent-deep">
                    {site.email}
                  </a>
                </li>
                <li>
                  <p className="label">Atendimento</p>
                  <p className="mt-1 text-lg">
                    Presencial na sede ou remoto, em todo o Brasil.{" "}
                    <Link
                      href="/contato"
                      className="font-medium text-accent-deep underline decoration-accent/40 underline-offset-4 hover:text-accent"
                    >
                      Endereço e mapa
                    </Link>
                  </p>
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
