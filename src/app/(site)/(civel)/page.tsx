import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import AreaCard from "@/components/AreaCard";
import PostCard from "@/components/PostCard";
import StatCounter from "@/components/StatCounter";
import ContactForm from "@/components/ContactForm";
import Photo from "@/components/Photo";
import JsonLd from "@/components/JsonLd";
import { site, stats } from "@/data/site";
import { areas } from "@/data/areas";
import { team } from "@/data/team";
import { getAllPosts } from "@/lib/blog";
import { servidorPages } from "@/data/servidores";
import { legalServiceJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "André Araújo Advogados | Advocacia em Formiga, MG",
  description:
    "Escritório de advocacia em Formiga, MG, com duas vertentes: Direito do Servidor Público e Direito Cível e Empresarial, para pessoas, empresas e servidores.",
  path: "/",
});

// A home é estática, mas revalida a cada 5 min para refletir os posts mais
// recentes do blog (a seção de destaques lê do Blob).
export const revalidate = 300;

const diferenciais = [
  {
    title: "Atendimento próximo e regional",
    text: "Escritório de Formiga, para Formiga e região. Você fala com quem conduz o seu caso.",
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

      {/* 2. Hero — ocupa exatamente a altura da viewport (100svh) em qualquer resolução */}
      <section className="flex min-h-svh items-center px-5 pb-12 pt-24 lg:px-8">
        <div className="mx-auto grid w-full max-w-[1240px] items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <h1 className="text-balance font-serif text-[clamp(2.5rem,4.5vw,4.25rem)] font-medium leading-[1.05] tracking-[-0.015em] text-ink">
              Advocacia especializada para{" "}
              <em className="italic text-accent">Formiga e região</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-pretty text-ink-soft">
              Duas vertentes de atuação: Direito do Servidor Público e
              Direito Cível e Empresarial, a serviço de pessoas, empresas e
              servidores de Minas Gerais.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button href={site.whatsappHref} external size="lg">
                Falar no WhatsApp
              </Button>
              <Button href="/contato" variant="secondary" size="lg">
                Agendar atendimento
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="hidden lg:block">
            <div className="relative">
              <div
                aria-hidden
                className="absolute -bottom-5 -right-5 h-full w-full rounded-md bg-accent-mist"
              />
              <Photo
                src="/images/escritorio/fachada.jpg"
                alt="Fachada do escritório André Araújo Advogados, com a placa e o logotipo, no centro de Formiga"
                ratio="4/5"
                preload
                sizes="(max-width: 1024px) 0px, 45vw"
                className="max-h-[calc(100svh-11rem)]"
                objectPosition="60% center"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. Barra de credibilidade */}
      <section aria-label="Números do escritório" className="px-5 lg:px-8">
        <div className="mx-auto max-w-[1240px] border-y border-line py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-line lg:[&>*]:px-10 lg:[&>*:first-child]:pl-0">
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

      {/* 4. Duas vertentes — o posicionamento do escritório */}
      <section className="px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <SectionHeading
              title="Duas vertentes, um mesmo padrão de atendimento"
              description="O escritório organiza sua atuação em duas frentes claras. Escolha o caminho que corresponde ao seu caso."
            />
          </Reveal>
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <Reveal className="h-full">
              <Link
                href="/servidores-publicos"
                className="group flex h-full flex-col rounded-md bg-wine p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(22,34,44,0.2)] lg:p-12"
              >
                <p aria-hidden className="font-serif text-sm italic text-paper/60">
                  01
                </p>
                <h3 className="mt-4 border-t border-paper/25 pt-5 font-serif text-2xl font-medium text-paper-light lg:text-3xl">
                  Direito do Servidor Público
                </h3>
                <p className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-paper/85">
                  Férias-prêmio, progressão e promoção, adicional noturno e
                  vale-transporte para servidores estaduais de Minas Gerais,
                  incluindo policiais penais.
                </p>
                <span className="mt-8 font-medium text-paper-light">
                  Conhecer a vertente
                </span>
              </Link>
            </Reveal>
            <Reveal delay={0.08} className="h-full">
              <Link
                href="/areas-de-atuacao"
                className="group flex h-full flex-col rounded-md bg-ink p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(22,34,44,0.2)] lg:p-12"
              >
                <p aria-hidden className="font-serif text-sm italic text-paper/60">
                  02
                </p>
                <h3 className="mt-4 border-t border-paper/25 pt-5 font-serif text-2xl font-medium text-paper-light lg:text-3xl">
                  Direito Cível e Empresarial
                </h3>
                <p className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-paper/85">
                  Tributário, imobiliário, condominial, empresarial, consumidor,
                  trabalhista, sucessões, família e recuperação de crédito para
                  pessoas, condomínios e empresas da região.
                </p>
                <span className="mt-8 font-medium text-paper-light">
                  Conhecer a vertente
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. Direito Cível e Empresarial — as áreas */}
      <section className="border-y border-line bg-paper-light px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                title="Direito Cível e Empresarial"
                description={`${areas.length} áreas de atuação para resolver as questões jurídicas de pessoas, condomínios e empresas da região.`}
              />
              <Link
                href="/areas-de-atuacao"
                className="font-medium text-accent-deep transition-colors hover:text-accent"
              >
                Ver a vertente completa
              </Link>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area, i) => (
              <Reveal key={area.slug} delay={(i % 3) * 0.08} className="h-full">
                <AreaCard area={area} index={i + 1} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Por que o André Araújo Advogados — seção escura, contraponto editorial */}
      <section className="bg-ink px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <SectionHeading dark title="Advocacia de confiança, do jeito que deveria ser" />
          </Reveal>
          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {diferenciais.map(({ title, text }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <p
                  aria-hidden
                  className="font-serif text-sm italic text-paper/50"
                >
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 border-t border-paper/20 pt-4 font-serif text-xl font-medium text-paper-light">
                  {title}
                </h3>
                <p className="mt-3 text-[0.9375rem] text-paper/75">{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Equipe — André em destaque com resumo do currículo */}
      <section className="px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <SectionHeading
              title="Quem conduz o seu caso"
              description="O escritório é liderado pelo sócio fundador André Augusto de Araújo, à frente de uma equipe de 12 profissionais."
            />
          </Reveal>
          <div className="mt-14 grid items-center gap-10 lg:grid-cols-[380px_1fr] lg:gap-16">
            <Reveal>
              <Photo
                src={andre.photo!}
                alt={`Foto de ${andre.name}`}
                ratio="1/1"
                sizes="(max-width: 1024px) 100vw, 380px"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="font-serif text-2xl font-medium text-ink lg:text-3xl">
                {andre.name}
              </h3>
              <p className="mt-2 text-ink-soft">
                {andre.role}, {andre.oab}
              </p>
              <p className="mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-soft">
                Graduado em Direito pelo UNIFOR-MG, com pós-graduações em
                Direito Empresarial e Advocacia Empresarial e em Direito
                Tributário (Anhanguera Uniderp) e em Advocacia Tributária
                (FUMEC), é pós-graduando em Direito Tributário pelo IBET e
                membro da ABRADT. Soma mais de 12 anos de advocacia preventiva,
                consultiva e contenciosa nas áreas cível, empresarial,
                trabalhista e tributária.
              </p>
              <div className="mt-8">
                <Button href="/equipe" variant="secondary">
                  Conheça toda a equipe
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 7. Blog — fundo em tom claro do acento (accent-mist) */}
      <section className="border-y border-line bg-accent-mist px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading title="Informação jurídica em linguagem clara" />
              <Button href="/blog" variant="secondary">
                Ver todos os artigos
              </Button>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {recentPosts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.08} className="h-full">
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Direito do Servidor Público — faixa vinho de conversão */}
      <section className="bg-wine px-5 py-24 text-center lg:px-8 lg:py-32">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <h2 className="text-balance mx-auto max-w-2xl font-serif text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.1] text-paper-light">
              Você é servidor público estadual?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-paper/85">
              O escritório orienta servidores de Minas Gerais, incluindo
              policiais penais, sobre direitos da carreira.
            </p>
            <ul className="mt-9 flex flex-wrap justify-center gap-3">
              {servidorPages.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/servidores-publicos/${p.slug}`}
                    className="inline-block rounded-sm border border-paper/40 px-6 py-3 text-[0.9375rem] font-medium text-paper-light transition-colors hover:border-paper-light hover:bg-paper/10"
                  >
                    {p.shortLabel}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-9">
              <Button href="/servidores-publicos" variant="light" size="lg">
                Conheça seus direitos
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 9. Contato */}
      <section className="px-5 pb-28 pt-24 lg:px-8 lg:pb-36 lg:pt-32">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <SectionHeading
              title="Vamos conversar sobre o seu caso"
              description="Envie sua mensagem ou fale direto pelos nossos canais. Retornamos o quanto antes."
            />
          </Reveal>
          <div className="mt-14 grid gap-12 lg:grid-cols-2">
            <Reveal>
              <ContactForm />
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="space-y-6 text-ink">
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
                  <p className="label">Endereço</p>
                  <p className="mt-1 text-lg">{site.address.full}</p>
                </li>
              </ul>
              <div className="mt-10 overflow-hidden rounded-md border border-line">
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
