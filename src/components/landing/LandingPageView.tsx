import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import CardRail from "@/components/landing/CardRail";
import Slider from "@/components/landing/Slider";
import { LpPicture, staticKit, type LandingKit, type LpPath } from "@/components/landing/kit";
import {
  LP_IMAGES,
  linkHref,
  newItem,
  whatsappHref,
  type LandingPage,
  type LandingPageInput,
  type LpSection,
  type LpSectionOf,
} from "@/data/landing";
import type { Post } from "@/data/posts";
import { site } from "@/data/site";
import { founderOf, initialsOf, type TeamMember } from "@/data/team";
import { faqPageJsonLd } from "@/lib/jsonld";

/**
 * Landing page de campanha: o layout do arquivo do Figma no sistema visual do
 * site (Instrument Sans e Serif, azul-tinta, creme, branco e dourado). Serve
 * ao site público e ao editor visual do painel, que passa o próprio `kit`
 * (ver kit.tsx).
 *
 * As medidas responsivas usam consultas de contêiner (@container, cqi) em vez
 * da largura da janela: assim a pré-visualização de celular do editor, que
 * só estreita a página, mostra exatamente o layout do celular. As proporções
 * em cqi reproduzem as do Figma (quadro de 1440px).
 *
 * Seções com imagens que sangram a borda usam overflow-clip, e não hidden:
 * um contêiner hidden ainda rola quando algo dentro dele recebe foco, e no
 * editor clicar numa imagem empurraria a seção para o lado.
 */

type Ctx = {
  K: LandingKit;
  wa: string;
  page: LandingPageInput;
  team: TeamMember[];
  posts: Post[];
};

/** Bloco de conteúdo de 1240px com o recuo lateral da página. */
const wrap = "mx-auto box-content max-w-[1240px] px-[var(--lp-gutter)]";
const eyebrowOnDark = "text-sm font-medium uppercase tracking-[0.18em] text-gold";
const eyebrowOnLight = "text-sm font-medium uppercase tracking-[0.18em] text-accent";
const heading = "text-balance text-lp-heading";

/** Membros exibidos: os escolhidos no painel ou o sócio e advogados com foto. */
export function resolveMembers(slugs: string[], team: TeamMember[]): TeamMember[] {
  if (slugs.length > 0) {
    return slugs
      .map((slug) => team.find((m) => m.slug === slug))
      .filter((m): m is TeamMember => Boolean(m));
  }
  if (team.length === 0) return [];
  const founder = founderOf(team);
  const lawyers = team.filter((m) => m.slug !== founder.slug && m.oab && m.photo);
  return [founder, ...lawyers].slice(0, 3);
}

/** Posts da seção de blog: a categoria escolhida (ou todos), os 3 mais novos. */
export function postsFor(category: string, posts: Post[]): Post[] {
  return (category ? posts.filter((p) => p.category === category) : posts).slice(0, 3);
}

function Hero({ ctx }: { ctx: Ctx }) {
  const { K, wa, page } = ctx;
  const h = page.hero;
  const p: LpPath = ["hero"];
  return (
    <section className="relative isolate overflow-clip bg-[linear-gradient(110deg,var(--color-accent-surface-deep)_5%,var(--color-ink)_55%,color-mix(in_oklab,var(--color-ink)_84%,var(--color-paper-light))_100%)] text-paper-light @5xl:flex @5xl:min-h-[clamp(42rem,52.5cqi,56rem)] @5xl:items-center">
      {/* Texto acima da imagem; o contêiner não captura cliques para a
          imagem continuar clicável no editor */}
      <div className={`${wrap} pointer-events-none relative z-10 min-w-0 pt-32 @5xl:flex-1 @5xl:pb-24 @5xl:pt-36`}>
        <Reveal className="pointer-events-auto max-w-[40rem] @5xl:max-w-[46%]">
          <K.Text
            path={[...p, "eyebrow"]}
            value={h.eyebrow}
            as="p"
            className={`mb-6 block ${eyebrowOnDark}`}
            placeholder="Sobretítulo (opcional)"
          />
          <h1 className="text-balance text-lp-hero text-paper-light">
            <K.Text path={[...p, "title"]} value={h.title} placeholder="Título principal" />{" "}
            <em className="text-gold">
              <K.Text
                path={[...p, "highlight"]}
                value={h.highlight}
                placeholder="trecho em destaque (opcional)"
              />
            </em>
          </h1>
          <K.Text
            path={[...p, "text"]}
            value={h.text}
            as="p"
            multiline
            className="mt-8 block max-w-xl text-lg text-pretty text-paper/75"
            placeholder="Uma ou duas frases sobre o problema que a página resolve"
          />
          <div className="mt-10">
            <K.Btn
              path={[...p, "button"]}
              value={h.button}
              href={linkHref(h.button.link, wa)}
              variant="light"
            />
          </div>
        </Reveal>
      </div>

      {/* Imagem recortada: abaixo do texto no celular; à direita, sangrando
          a borda inferior, no desktop. Os louros ficam atrás, cortados pela
          borda direita, como no layout. */}
      <div className="relative h-[24rem] @xl:h-[30rem] @5xl:absolute @5xl:inset-0 @5xl:h-auto">
        {h.ornament && (
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[-2rem] left-[50%] aspect-[577/515] h-[108%] @5xl:bottom-[-4.1cqi] @5xl:left-[75cqi] @5xl:h-auto @5xl:w-[min(53.7cqi,59rem)]"
          >
            <Image
              src={LP_IMAGES.louros}
              alt=""
              fill
              sizes="(min-width: 1024px) 54vw, 90vw"
              className="object-contain"
            />
          </div>
        )}
        <div className="absolute bottom-0 left-1/2 aspect-[712/989] h-full -translate-x-1/2 @5xl:bottom-[-1.7cqi] @5xl:left-[65.8cqi] @5xl:h-auto @5xl:w-[min(31cqi,34rem)] @5xl:translate-x-0">
          <K.Img
            path={[...p, "image"]}
            value={h.image}
            className="object-contain object-bottom"
            sizes="(min-width: 1024px) 31vw, 70vw"
            preload
            hint="Use uma imagem recortada (PNG ou WebP com fundo transparente) ou uma foto vertical."
          />
        </div>
      </div>
    </section>
  );
}

function CardsSection({ s, i, ctx }: { s: LpSectionOf<"cards">; i: number; ctx: Ctx }) {
  const { K } = ctx;
  const list: LpPath = ["sections", i, "items"];
  return (
    <section className="relative overflow-clip bg-paper pb-16 pt-20 @5xl:pb-[5.3cqi] @5xl:pt-[4.6cqi]">
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-5.3cqi] top-0 hidden aspect-[431/314] w-[23.4cqi] rotate-180 @3xl:block"
      >
        <Image src={LP_IMAGES.curvas} alt="" fill sizes="24vw" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-[-1cqi] hidden aspect-[431/314] w-[23.4cqi] @3xl:block"
      >
        <Image src={LP_IMAGES.curvas} alt="" fill sizes="24vw" />
      </div>

      <div className={`${wrap} relative text-center`}>
        <Reveal>
          <K.Text
            path={["sections", i, "title"]}
            value={s.title}
            as="h2"
            className={`mx-auto block max-w-3xl ${heading} text-ink`}
            placeholder="Título da seção"
          />
          <K.Text
            path={["sections", i, "text"]}
            value={s.text}
            as="p"
            multiline
            className="mx-auto mt-6 block max-w-[34rem] text-lg text-pretty text-ink-soft"
            placeholder="Texto de apoio (opcional)"
          />
        </Reveal>
      </div>

      <div className="relative mt-10 @5xl:mt-12">
        <CardRail
          label={s.title || "Cards"}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-pl-[var(--lp-edge)] pb-10 pl-[var(--lp-edge)] pr-[var(--lp-gutter)] pt-6 [scrollbar-width:none] @5xl:gap-[2.8cqi] [&::-webkit-scrollbar]:hidden"
          controlsClassName={`${wrap} flex justify-end gap-4`}
        >
          {s.items.map((item, j) => (
            <K.Item
              key={j}
              as="li"
              list={list}
              index={j}
              count={s.items.length}
              className="group relative aspect-[310/419] w-[72cqi] shrink-0 snap-start overflow-hidden border border-accent/70 bg-ink shadow-[0_4px_35px_rgba(22,34,44,0.25)] @xl:w-[44cqi] @3xl:w-[30cqi] @5xl:w-[21.5cqi]"
            >
              <K.Img
                path={[...list, j, "image"]}
                value={item.image}
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 75vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_32%,rgb(13_19_25/0.94)_100%)]"
              />
              <K.Text
                path={[...list, j, "title"]}
                value={item.title}
                as="h3"
                className="absolute inset-x-5 bottom-7 block text-balance text-center text-lp-card text-gold"
                placeholder="Título do card"
              />
              {!K.editing && item.href && (
                <Link href={item.href} className="absolute inset-0" aria-label={item.title} />
              )}
            </K.Item>
          ))}
          {K.editing && (
            <li className="flex aspect-[310/419] w-[72cqi] shrink-0 @xl:w-[44cqi] @3xl:w-[30cqi] @5xl:w-[21.5cqi]">
              <K.Add
                list={list}
                count={s.items.length}
                make={newItem.card}
                label="Adicionar card"
                className="h-full w-full"
              />
            </li>
          )}
        </CardRail>
      </div>
    </section>
  );
}

function NumerosSection({ s, i, ctx }: { s: LpSectionOf<"numeros">; i: number; ctx: Ctx }) {
  const { K } = ctx;
  const list: LpPath = ["sections", i, "items"];
  return (
    <section className="relative overflow-clip bg-paper-light py-20 @5xl:py-[6cqi]">
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-2 left-0 hidden aspect-[319/609] w-[13cqi] @3xl:block"
      >
        <Image src={LP_IMAGES.justicaTraco} alt="" fill sizes="13vw" />
      </div>
      <div className={`${wrap} relative text-center`}>
        <Reveal>
          <K.Text
            path={["sections", i, "title"]}
            value={s.title}
            as="h2"
            className={`mx-auto block max-w-[40rem] ${heading} text-ink`}
            placeholder="Título da seção"
          />
          <K.Text
            path={["sections", i, "text"]}
            value={s.text}
            as="p"
            multiline
            className="mx-auto mt-6 block max-w-[34rem] text-lg text-pretty text-ink-soft"
            placeholder="Texto de apoio (opcional)"
          />
        </Reveal>
        <ul className="mx-auto mt-14 grid max-w-[64rem] grid-cols-2 gap-y-12 @5xl:mt-20 @5xl:grid-cols-4 @5xl:gap-y-0 @5xl:divide-x @5xl:divide-line">
          {s.items.map((item, j) => (
            <K.Item
              key={j}
              as="li"
              list={list}
              index={j}
              count={s.items.length}
              className="px-3 @5xl:px-6 @5xl:py-10"
            >
              <Reveal delay={j * 0.08}>
                {/* Valor curto (até 4 caracteres) no corpo grande do layout;
                    mais longo ("1.000+", "Brasil") desce um degrau para caber */}
                <K.Text
                  path={[...list, j, "value"]}
                  value={item.value}
                  as="p"
                  className={`block whitespace-nowrap [overflow-wrap:normal] text-ink ${
                    item.value.length > 4 ? "text-lp-heading" : "text-lp-stat"
                  }`}
                  placeholder="00"
                />
                <K.Text
                  path={[...list, j, "label"]}
                  value={item.label}
                  as="p"
                  className="mx-auto mt-4 block max-w-[15rem] text-lg leading-snug text-ink @5xl:text-xl"
                  placeholder="Descrição"
                />
              </Reveal>
            </K.Item>
          ))}
        </ul>
        {K.editing && (
          <div className="mt-8 flex justify-center">
            <K.Add list={list} count={s.items.length} make={newItem.numero} label="Adicionar número" />
          </div>
        )}
      </div>
    </section>
  );
}

function DestaqueSection({ s, i, ctx }: { s: LpSectionOf<"destaque">; i: number; ctx: Ctx }) {
  const { K, wa } = ctx;
  const p: LpPath = ["sections", i];
  return (
    <section className="relative overflow-clip bg-ink py-20 text-paper-light @5xl:py-24">
      <div
        className={`${wrap} grid items-center gap-14 @5xl:grid-cols-[minmax(0,25cqi)_minmax(0,1fr)] @5xl:gap-[10cqi]`}
      >
        <Reveal className="relative">
          <div
            aria-hidden
            className="absolute left-[-34%] top-[8%] aspect-square w-[78%] rounded-full bg-gold @5xl:left-[-18.5cqi] @5xl:top-[2.6cqi] @5xl:w-[27cqi]"
          />
          <div className="relative aspect-[362/494] w-[80%] max-w-sm overflow-hidden bg-accent-surface-deep @5xl:-ml-[2.4cqi] @5xl:w-full @5xl:max-w-none">
            <K.Img
              path={[...p, "image"]}
              value={s.image}
              sizes="(min-width: 1024px) 25vw, 80vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <K.Text
            path={[...p, "eyebrow"]}
            value={s.eyebrow}
            as="p"
            className={`mb-6 block ${eyebrowOnDark}`}
            placeholder="Sobretítulo (opcional)"
          />
          <h2 className={`${heading} max-w-[38rem] text-paper-light`}>
            <K.Text path={[...p, "title"]} value={s.title} placeholder="Título" />{" "}
            <em className="text-gold">
              <K.Text path={[...p, "highlight"]} value={s.highlight} placeholder="destaque (opcional)" />
            </em>
          </h2>
          <K.Text
            path={[...p, "text"]}
            value={s.text}
            as="p"
            multiline
            className="mt-8 block max-w-[40rem] text-lg text-pretty text-paper/75 @5xl:text-xl @5xl:leading-relaxed"
            placeholder="Texto"
          />
          <div className="mt-10">
            <K.Btn
              path={[...p, "button"]}
              value={s.button}
              href={linkHref(s.button.link, wa)}
              variant="light"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function DepoimentosSection({
  s,
  i,
  ctx,
}: {
  s: LpSectionOf<"depoimentos">;
  i: number;
  ctx: Ctx;
}) {
  const { K, wa } = ctx;
  const p: LpPath = ["sections", i];
  const list: LpPath = [...p, "items"];
  return (
    <section className="bg-paper-light py-24 @5xl:py-40">
      <div
        className={`${wrap} grid gap-12 @5xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] @5xl:items-start @5xl:gap-[7.8cqi]`}
      >
        <Reveal>
          <K.Text
            path={[...p, "eyebrow"]}
            value={s.eyebrow}
            as="p"
            className={`mb-6 block ${eyebrowOnLight}`}
            placeholder="Sobretítulo (opcional)"
          />
          <K.Text
            path={[...p, "title"]}
            value={s.title}
            as="h2"
            className={`block max-w-[32rem] ${heading} text-ink`}
            placeholder="Título"
          />
          <div className="mt-10">
            <K.Btn
              path={[...p, "button"]}
              value={s.button}
              href={linkHref(s.button.link, wa)}
              variant="primary"
            />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <Slider
            label={s.title || "Depoimentos"}
            dotsClassName="mt-10 flex justify-center gap-1"
            slides={s.items.map((d, j) => (
              <K.Item key={j} list={list} index={j} count={s.items.length}>
                <figure>
                  <blockquote>
                    <K.Text
                      path={[...list, j, "quote"]}
                      value={d.quote}
                      as="p"
                      multiline
                      className="block text-xl leading-relaxed text-pretty text-ink"
                      placeholder="Depoimento"
                    />
                  </blockquote>
                  <figcaption className="mt-8">
                    <K.Text
                      path={[...list, j, "name"]}
                      value={d.name}
                      as="p"
                      className="block font-semibold text-ink"
                      placeholder="Nome"
                    />
                    <K.Text
                      path={[...list, j, "role"]}
                      value={d.role}
                      as="p"
                      className="mt-1 block text-ink-soft"
                      placeholder="Origem do depoimento"
                    />
                  </figcaption>
                </figure>
              </K.Item>
            ))}
          />
          {K.editing && (
            <div className="mt-6 flex justify-center">
              <K.Add
                list={list}
                count={s.items.length}
                make={newItem.depoimento}
                label="Adicionar depoimento"
              />
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function EquipeSection({ s, i, ctx }: { s: LpSectionOf<"equipe">; i: number; ctx: Ctx }) {
  const { K, team } = ctx;
  const members = resolveMembers(s.members, team);
  return (
    <section className="bg-paper py-24 @5xl:py-32">
      <div className={`${wrap} text-center`}>
        <Reveal>
          <K.Text
            path={["sections", i, "title"]}
            value={s.title}
            as="h2"
            className={`mx-auto block max-w-3xl ${heading} text-ink`}
            placeholder="Título"
          />
          <K.Text
            path={["sections", i, "text"]}
            value={s.text}
            as="p"
            multiline
            className="mx-auto mt-6 block max-w-[34rem] text-lg text-pretty text-ink-soft"
            placeholder="Texto de apoio (opcional)"
          />
        </Reveal>
        {/* Linha centralizada: 1, 2 ou 3 pessoas ficam no meio, como no layout */}
        <ul className="mt-14 flex flex-wrap justify-center gap-x-[7.9cqi] gap-y-14 @5xl:mt-20">
          {members.map((m, j) => {
            const card = (
              <>
                <div className="relative mx-auto aspect-square w-full max-w-[20.625rem] overflow-hidden rounded-full bg-accent-mist">
                  {m.photo ? (
                    <Image
                      src={m.photo}
                      alt={`Foto de ${m.name}`}
                      fill
                      sizes="(min-width: 1024px) 330px, 80vw"
                      unoptimized={!m.photo.startsWith("/") && !m.photo.includes(".public.blob.vercel-storage.com/")}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  ) : (
                    <span className="absolute inset-0 grid place-items-center font-serif text-6xl italic text-accent/50">
                      {initialsOf(m.name)}
                    </span>
                  )}
                </div>
                <p className="mt-8 text-lg font-semibold text-ink">{m.name}</p>
                <p className="mt-1 text-ink-soft">{[m.role, m.oab].filter(Boolean).join(", ")}</p>
              </>
            );
            return (
              <li
                key={m.slug}
                className="w-full max-w-[20.625rem] @xl:w-[calc(50%-4cqi)] @5xl:w-[min(20.625rem,calc((100%-15.8cqi)/3))]"
              >
                <Reveal delay={j * 0.08}>
                  {m.hasProfile && !K.editing ? (
                    <Link href={`/equipe/${m.slug}`} className="group block">
                      {card}
                    </Link>
                  ) : (
                    <div className="group">{card}</div>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function BlogSection({ s, i, ctx }: { s: LpSectionOf<"blog">; i: number; ctx: Ctx }) {
  const { K, posts } = ctx;
  const list = postsFor(s.category, posts);
  if (list.length === 0 && !K.editing) return null;
  return (
    <section className="bg-ink py-24 text-paper-light @5xl:py-28">
      <div className={wrap}>
        <Reveal className="text-center">
          <K.Text
            path={["sections", i, "title"]}
            value={s.title}
            as="h2"
            className={`mx-auto block max-w-3xl ${heading} text-paper-light`}
            placeholder="Título"
          />
        </Reveal>
        {list.length === 0 ? (
          <p className="mt-10 text-center text-paper/70">
            Ainda não há posts nesta categoria. A seção fica oculta no site até haver algum.
          </p>
        ) : (
          <ul className="mt-14 flex flex-wrap justify-center gap-x-[8.4cqi] gap-y-12 @5xl:mt-16">
            {list.map((post, j) => {
              const tile = (
                <>
                  <div className="relative aspect-[344/422] overflow-hidden bg-accent-surface-deep">
                    {post.image ? (
                      <LpPicture
                        value={{ src: post.image.src, alt: post.image.alt }}
                        sizes="(min-width: 768px) 30vw, 90vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    ) : (
                      <span
                        aria-hidden
                        className="absolute inset-0 grid place-items-center font-serif text-5xl italic text-gold/40"
                      >
                        AA
                      </span>
                    )}
                  </div>
                  <h3 className="mt-5 text-lg leading-snug text-paper/90 transition-colors group-hover:text-gold">
                    {post.title}
                  </h3>
                </>
              );
              return (
                <li key={post.slug} className="w-full @3xl:w-[calc((100%-16.8cqi)/3)]">
                  <Reveal delay={j * 0.08}>
                    {K.editing ? (
                      <div className="group">{tile}</div>
                    ) : (
                      <Link href={`/blog/${post.slug}`} className="group block">
                        {tile}
                      </Link>
                    )}
                  </Reveal>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

function GaleriaSection({ s, i, ctx }: { s: LpSectionOf<"galeria">; i: number; ctx: Ctx }) {
  const { K } = ctx;
  const list: LpPath = ["sections", i, "images"];
  // Até 3 fotos: faixa centralizada, com as laterais cortadas pela borda
  // (como no layout). Mais que isso: trilho com rolagem lateral.
  const centered = s.images.length <= 3;
  return (
    <section className="overflow-clip bg-paper-light py-24 @5xl:py-28">
      <div className={`${wrap} text-center`}>
        <Reveal>
          <K.Text
            path={["sections", i, "title"]}
            value={s.title}
            as="h2"
            className={`mx-auto block max-w-3xl ${heading} text-ink`}
            placeholder="Título"
          />
        </Reveal>
      </div>
      <ul
        className={`mt-14 flex gap-5 @5xl:mt-20 @5xl:gap-[4.5cqi] ${
          centered
            ? "justify-center"
            : "snap-x snap-mandatory overflow-x-auto scroll-pl-[var(--lp-edge)] pl-[var(--lp-edge)] pr-[var(--lp-gutter)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        }`}
      >
        {s.images.map((img, j) => (
          <K.Item
            key={j}
            as="li"
            list={list}
            index={j}
            count={s.images.length}
            className="relative aspect-[577/396] w-[80cqi] shrink-0 snap-start overflow-hidden bg-line @3xl:w-[52cqi] @5xl:w-[40cqi]"
          >
            <K.Img
              path={[...list, j]}
              value={img}
              sizes="(min-width: 1024px) 40vw, 80vw"
              className="object-cover"
            />
          </K.Item>
        ))}
      </ul>
      {K.editing && (
        <div className="mt-8 flex justify-center">
          <K.Add list={list} count={s.images.length} make={newItem.foto} label="Adicionar foto" />
        </div>
      )}
    </section>
  );
}

function PerguntasSection({ s, i, ctx }: { s: LpSectionOf<"perguntas">; i: number; ctx: Ctx }) {
  const { K } = ctx;
  const p: LpPath = ["sections", i];
  const list: LpPath = [...p, "items"];
  return (
    <section className="bg-paper-light py-24 @5xl:py-32">
      {!K.editing && s.items.length > 0 && <JsonLd data={faqPageJsonLd(s.items)} />}
      <div
        className={`${wrap} grid gap-12 @5xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] @5xl:items-start @5xl:gap-[7.8cqi]`}
      >
        <Reveal className="@5xl:sticky @5xl:top-32">
          <K.Text
            path={[...p, "eyebrow"]}
            value={s.eyebrow}
            as="p"
            className={`mb-6 block ${eyebrowOnLight}`}
            placeholder="Sobretítulo (opcional)"
          />
          <K.Text
            path={[...p, "title"]}
            value={s.title}
            as="h2"
            className={`block max-w-[32rem] ${heading} text-ink`}
            placeholder="Título"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="divide-y divide-line border-y border-line">
            {s.items.map((item, j) =>
              K.editing ? (
                <K.Item key={j} list={list} index={j} count={s.items.length} className="py-6">
                  <K.Text
                    path={[...list, j, "question"]}
                    value={item.question}
                    as="h3"
                    className="block pr-28 text-xl leading-snug text-ink"
                    placeholder="Pergunta"
                  />
                  <K.Text
                    path={[...list, j, "answer"]}
                    value={item.answer}
                    as="p"
                    multiline
                    className="mt-3 block text-pretty text-ink-soft"
                    placeholder="Resposta"
                  />
                </K.Item>
              ) : (
                <details key={j} className="group py-6">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-xl leading-snug text-ink transition-colors hover:text-accent-deep [&::-webkit-details-marker]:hidden">
                    <h3>{item.question}</h3>
                    <Plus
                      aria-hidden
                      className="mt-1 size-5 shrink-0 text-accent transition-transform duration-300 group-open:rotate-45"
                    />
                  </summary>
                  <p className="mt-4 whitespace-pre-line text-pretty text-ink-soft">{item.answer}</p>
                </details>
              )
            )}
          </div>
          {K.editing && (
            <div className="mt-6">
              <K.Add list={list} count={s.items.length} make={newItem.pergunta} label="Adicionar pergunta" />
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function ContatoSection({ s, i, ctx }: { s: LpSectionOf<"contato">; i: number; ctx: Ctx }) {
  const { K, wa, page } = ctx;
  return (
    <section id="contato" className="scroll-mt-24 bg-paper py-24 @5xl:py-32">
      <div className={`${wrap} grid gap-12 @5xl:grid-cols-2 @5xl:gap-[7cqi]`}>
        <Reveal>
          <K.Text
            path={["sections", i, "title"]}
            value={s.title}
            as="h2"
            className={`block ${heading} text-ink`}
            placeholder="Título"
          />
          <K.Text
            path={["sections", i, "text"]}
            value={s.text}
            as="p"
            multiline
            className="mt-6 block max-w-xl text-lg text-pretty text-ink-soft"
            placeholder="Texto de apoio (opcional)"
          />
          <ul className="mt-10 space-y-6 text-ink">
            <li>
              <p className="label">WhatsApp</p>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-lg font-medium hover:text-accent-deep"
              >
                {site.whatsapp}
              </a>
            </li>
            <li>
              <p className="label">Telefone</p>
              <a href={site.phoneHref} className="mt-1 inline-block text-lg font-medium hover:text-accent-deep">
                {site.phone}
              </a>
            </li>
            <li>
              <p className="label">E-mail</p>
              <a
                href={site.emailHref}
                className="mt-1 inline-block break-words text-lg font-medium hover:text-accent-deep"
              >
                {site.email}
              </a>
            </li>
            <li>
              <p className="label">Atendimento</p>
              <p className="mt-1 text-lg">Presencial na sede ou online, em todo o Brasil.</p>
            </li>
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          {/* No editor o formulário é só a prévia: não envia nada */}
          <div
            className={K.editing ? "pointer-events-none select-none" : undefined}
            inert={K.editing || undefined}
          >
            <ContactForm assuntoInicial={page.name || undefined} origem={page.slug || undefined} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SectionBody({ section, index, ctx }: { section: LpSection; index: number; ctx: Ctx }) {
  switch (section.type) {
    case "cards":
      return <CardsSection s={section} i={index} ctx={ctx} />;
    case "numeros":
      return <NumerosSection s={section} i={index} ctx={ctx} />;
    case "destaque":
      return <DestaqueSection s={section} i={index} ctx={ctx} />;
    case "depoimentos":
      return <DepoimentosSection s={section} i={index} ctx={ctx} />;
    case "equipe":
      return <EquipeSection s={section} i={index} ctx={ctx} />;
    case "blog":
      return <BlogSection s={section} i={index} ctx={ctx} />;
    case "galeria":
      return <GaleriaSection s={section} i={index} ctx={ctx} />;
    case "perguntas":
      return <PerguntasSection s={section} i={index} ctx={ctx} />;
    case "contato":
      return <ContatoSection s={section} i={index} ctx={ctx} />;
  }
}

export default function LandingPageView({
  page,
  team,
  posts,
  kit = staticKit,
  preview = false,
}: {
  page: LandingPage | LandingPageInput;
  /** Equipe salva no painel (seção Equipe) */
  team: TeamMember[];
  /** Posts do blog (seção Publicações) */
  posts: Post[];
  /** Peças editáveis do editor visual; o site usa o kit estático */
  kit?: LandingKit;
  /** Faixa de aviso da pré-visualização do painel */
  preview?: boolean;
}) {
  const ctx: Ctx = {
    K: kit,
    wa: whatsappHref(site.whatsapp, page.whatsappMessage),
    page,
    team,
    posts,
  };
  const K = kit;

  return (
    <div className="@container">
      <div className="[--lp-edge:max(var(--lp-gutter),calc((100cqi_-_1240px)/2))] [--lp-gutter:1.25rem] @3xl:[--lp-gutter:2.5rem] @7xl:[--lp-gutter:4rem]">
        {preview && (
          <p className="fixed inset-x-0 bottom-0 z-40 bg-gold px-5 py-2 text-center text-sm font-medium text-ink">
            Pré-visualização
            {page.status === "rascunho" ? " de rascunho: esta página ainda não está no ar" : ""}.
          </p>
        )}
        <Hero ctx={ctx} />
        {page.sections.map((section, index) => (
          <K.Section key={section.id} index={index} section={section}>
            <SectionBody section={section} index={index} ctx={ctx} />
          </K.Section>
        ))}
      </div>
    </div>
  );
}
