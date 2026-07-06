import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HeartHandshake, Eye, MessagesSquare, Scale, MessageCircle } from "lucide-react";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import AreaCard from "@/components/AreaCard";
import TeamCard from "@/components/TeamCard";
import PostCard from "@/components/PostCard";
import StatCounter from "@/components/StatCounter";
import ContactForm from "@/components/ContactForm";
import PhotoPlaceholder from "@/components/PhotoPlaceholder";
import JsonLd from "@/components/JsonLd";
import { site, stats } from "@/data/site";
import { areas } from "@/data/areas";
import { team } from "@/data/team";
import { posts } from "@/data/posts";
import { servidorPages } from "@/data/servidores";
import { legalServiceJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "André Araújo Advogados | Advocacia em Formiga, MG",
  description:
    "Escritório de advocacia em Formiga, MG. Direito tributário, imobiliário, condominial, empresarial e mais para empresas e famílias da região.",
  path: "/",
});

const diferenciais = [
  {
    Icon: HeartHandshake,
    title: "Atendimento próximo e regional",
    text: "Escritório de Formiga, para Formiga e região. Você fala com quem conduz o seu caso.",
  },
  {
    Icon: Eye,
    title: "Transparência em cada etapa",
    text: "Você acompanha o andamento do seu caso e sabe o que esperar de cada fase.",
  },
  {
    Icon: MessagesSquare,
    title: "Comunicação acessível",
    text: "Explicamos o seu caso em linguagem clara, sem juridiquês.",
  },
  {
    Icon: Scale,
    title: "Atuação preventiva e contenciosa",
    text: "Prevenimos problemas antes que aconteçam e defendemos seus interesses quando necessário.",
  },
];

export default function Home() {
  const socios = team.slice(0, 2);
  const recentPosts = posts.slice(0, 3);

  return (
    <>
      <JsonLd data={legalServiceJsonLd()} />

      {/* 2. Hero */}
      <section className="px-5 pb-20 pt-36 lg:px-8 lg:pb-28 lg:pt-44">
        <div className="mx-auto grid max-w-[1240px] items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <p className="eyebrow mb-5">Advocacia em Formiga, MG</p>
            <h1 className="font-serif text-[clamp(2.75rem,6vw,4.75rem)] font-medium leading-[1.05] tracking-[-0.015em] text-ink">
              Advocacia especializada para Formiga e região
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink-soft">
              Atendimento a empresas e famílias em direito tributário,
              imobiliário, condominial, empresarial e mais.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button href={site.whatsappHref} external size="lg">
                <MessageCircle className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                Falar no WhatsApp
              </Button>
              <Button href="/contato" variant="secondary" size="lg">
                Agendar atendimento
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            {/* TODO: substituir pela foto real do escritório ou da equipe (proporção 4:5) */}
            <PhotoPlaceholder
              label="Foto real do escritório ou da equipe"
              ratio="4/5"
              className="shadow-[0_10px_40px_rgba(22,34,44,0.08)]"
            />
          </Reveal>
        </div>
      </section>

      {/* 3. Barra de credibilidade */}
      <section aria-label="Números do escritório" className="px-5 lg:px-8">
        <div className="mx-auto max-w-[1240px] border-y border-line py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.08}>
                <StatCounter
                  value={"display" in stat ? null : stat.value}
                  display={"display" in stat ? stat.display : undefined}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Áreas de Atuação */}
      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="Áreas de Atuação"
                title="Como podemos ajudar você"
                description="Sete áreas de atuação para resolver as questões jurídicas de pessoas, condomínios e empresas da região."
              />
              <Link
                href="/areas-de-atuacao"
                className="group inline-flex items-center gap-2 font-medium text-brass-deep"
              >
                Ver todas as áreas
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </Link>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area, i) => (
              <Reveal key={area.slug} delay={(i % 3) * 0.08} className="h-full">
                <AreaCard area={area} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Por que o André Araújo Advogados */}
      <section className="bg-paper-light px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <SectionHeading
              eyebrow="Por que o André Araújo Advogados"
              title="Advocacia de confiança, do jeito que deveria ser"
            />
          </Reveal>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {diferenciais.map(({ Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper text-brass">
                  <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
                </span>
                <h3 className="mt-5 font-serif text-xl font-medium text-ink">
                  {title}
                </h3>
                <p className="mt-3 text-[0.9375rem] text-ink-soft">{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Equipe — sócios em destaque */}
      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <SectionHeading
              eyebrow="Equipe"
              title="Quem conduz o seu caso"
              description="Uma equipe de 13 advogados inscritos na OAB/MG, liderada pelos sócios André Augusto de Araújo e Sávio Ribeiro Oliveira."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:max-w-3xl">
            {socios.map((lawyer, i) => (
              <Reveal key={lawyer.slug} delay={i * 0.08} className="h-full">
                <TeamCard lawyer={lawyer} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div className="mt-10">
              <Button href="/equipe" variant="secondary">
                Conheça toda a equipe
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7. Blog */}
      <section className="bg-paper-light px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="Blog"
                title="Informação jurídica em linguagem clara"
              />
              <Button href="/blog" variant="secondary">
                Ver todos os artigos
              </Button>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {recentPosts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.08} className="h-full">
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Bloco Servidores Públicos */}
      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px] rounded-[2rem] bg-ink px-6 py-16 text-center lg:px-16 lg:py-20">
          <Reveal>
            <p className="eyebrow mb-4">Servidores Públicos Estaduais</p>
            <h2 className="mx-auto max-w-2xl font-serif text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.1] text-paper-light">
              Você é servidor público estadual?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-paper/75">
              O escritório orienta servidores de Minas Gerais — incluindo
              policiais penais — sobre direitos da carreira.
            </p>
            <ul className="mt-9 flex flex-wrap justify-center gap-3">
              {servidorPages.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/servidores-publicos/${p.slug}`}
                    className="inline-block rounded-full border border-paper/30 px-6 py-3 text-[0.9375rem] font-medium text-paper-light transition-colors hover:border-brass hover:text-brass"
                  >
                    {p.shortLabel}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-9">
              <Button href="/servidores-publicos" variant="light" size="lg">
                Conheça seus direitos
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 9. Contato */}
      <section className="px-5 pb-24 lg:px-8 lg:pb-32">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <SectionHeading
              eyebrow="Contato"
              title="Vamos conversar sobre o seu caso"
              description="Envie sua mensagem ou fale direto pelos nossos canais. Retornamos o quanto antes."
            />
          </Reveal>
          <div className="mt-12 grid gap-12 lg:grid-cols-2">
            <Reveal>
              <ContactForm />
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="space-y-6 text-ink">
                <li>
                  <p className="eyebrow text-xs">Telefone</p>
                  <a href={site.phoneHref} className="mt-1 inline-block text-lg font-medium hover:text-brass-deep">
                    {site.phone}
                  </a>
                </li>
                <li>
                  <p className="eyebrow text-xs">WhatsApp</p>
                  <a
                    href={site.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-lg font-medium hover:text-brass-deep"
                  >
                    {site.whatsapp}
                  </a>
                </li>
                <li>
                  <p className="eyebrow text-xs">E-mail</p>
                  <a href={site.emailHref} className="mt-1 inline-block text-lg font-medium break-all hover:text-brass-deep">
                    {site.email}
                  </a>
                </li>
                <li>
                  <p className="eyebrow text-xs">Endereço</p>
                  <p className="mt-1 text-lg">{site.address.full}</p>
                </li>
              </ul>
              <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-line">
                <iframe
                  title="Mapa do escritório André Araújo Advogados em Formiga, MG"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapsQuery)}&output=embed`}
                  width="100%"
                  height="280"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block border-0"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
