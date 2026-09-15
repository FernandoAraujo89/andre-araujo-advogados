import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import ContactForm from "@/components/ContactForm";
import FaqAccordion from "@/components/FaqAccordion";
import GoogleReviews from "@/components/GoogleReviews";
import JsonLd from "@/components/JsonLd";
import Markdown from "@/components/Markdown";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { youtubeId, type LandingPage, type LpSection } from "@/data/landing";
import { site } from "@/data/site";
import { team } from "@/data/team";
import { faqPageJsonLd } from "@/lib/jsonld";

/**
 * Renderização pública de uma landing page montada no painel. O visual segue
 * o sistema do site (mesmos componentes das áreas fixas); o conteúdo e a
 * ordem das seções vêm do JSON gravado pelo cliente.
 */

function whatsappHref(message: string): string {
  const digits = site.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

const container = "mx-auto max-w-[1240px]";
const band = "px-5 py-20 lg:px-8 lg:py-28";

function Check() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
      className="mt-1 shrink-0 text-accent"
    >
      <circle cx="11" cy="11" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.5 11.5l3 3 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Section({
  section,
  index,
  wa,
}: {
  section: LpSection;
  index: number;
  wa: string;
}) {
  // Faixas alternadas: papel e papel-claro. CTA e avaliações têm cor própria.
  const alt = index % 2 === 1;
  const bg = alt ? "border-y border-line bg-paper-light" : "";

  switch (section.type) {
    case "texto":
      return (
        <section className={`${band} ${bg}`}>
          <div
            className={`${container} grid gap-12 ${
              section.image ? "lg:grid-cols-[1.1fr_1fr] lg:items-center" : ""
            }`}
          >
            <Reveal>
              <SectionHeading title={section.title} />
              <div className="mt-8 max-w-2xl">
                <Markdown>{section.text}</Markdown>
              </div>
            </Reveal>
            {section.image && (
              <Reveal delay={0.1}>
                <Photo
                  src={section.image.src}
                  alt={section.image.alt}
                  ratio="4/3"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </Reveal>
            )}
          </div>
        </section>
      );

    case "lista":
      return (
        <section className={`${band} ${bg}`}>
          <div className={container}>
            <Reveal>
              <SectionHeading title={section.title} description={section.intro} />
            </Reveal>
            <ul className="mt-10 grid gap-4 md:grid-cols-2">
              {section.items.map((item, i) => (
                <Reveal key={i} delay={(i % 2) * 0.08}>
                  <li className="flex gap-3 rounded-md border border-line bg-paper-light p-5 text-[1.0625rem] text-ink">
                    <Check />
                    <span>{item}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      );

    case "passos":
      return (
        <section className={`${band} ${bg}`}>
          <div className={container}>
            <Reveal>
              <SectionHeading title={section.title} description={section.intro} />
            </Reveal>
            <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <p aria-hidden className="font-serif text-sm italic text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 border-t border-line pt-4 font-serif text-xl font-medium text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[0.9375rem] text-ink-soft">{item.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      );

    case "cards":
      return (
        <section className={`${band} ${bg}`}>
          <div className={container}>
            <Reveal>
              <SectionHeading title={section.title} description={section.intro} />
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item, i) => (
                <Reveal key={i} delay={(i % 3) * 0.08} className="h-full">
                  <div className="h-full rounded-md border border-line bg-paper-light p-8">
                    <h3 className="font-serif text-xl font-medium text-ink">{item.title}</h3>
                    <p className="mt-3 text-[0.9375rem] text-ink-soft">{item.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      );

    case "sobre": {
      const [andre] = team;
      const image = section.image ?? {
        src: andre.photo ?? "",
        alt: `Foto de ${andre.name}`,
      };
      return (
        <section className={`${band} ${bg}`}>
          <div className={`${container} grid items-center gap-10 lg:grid-cols-[380px_1fr] lg:gap-16`}>
            <Reveal>
              {image.src && (
                <Photo
                  src={image.src}
                  alt={image.alt}
                  ratio="1/1"
                  sizes="(max-width: 1024px) 100vw, 380px"
                />
              )}
            </Reveal>
            <Reveal delay={0.1}>
              <SectionHeading title={section.title} />
              <div className="mt-6 max-w-2xl">
                <Markdown>{section.text}</Markdown>
              </div>
            </Reveal>
          </div>
        </section>
      );
    }

    case "avaliacoes":
      return <GoogleReviews />;

    case "faq":
      return (
        <section className={`${band} ${bg}`}>
          <JsonLd data={faqPageJsonLd(section.items)} />
          <div className={`${container} grid gap-12 lg:grid-cols-[1fr_1.4fr]`}>
            <Reveal>
              <SectionHeading title={section.title} />
            </Reveal>
            <Reveal delay={0.1}>
              <FaqAccordion items={section.items} />
            </Reveal>
          </div>
        </section>
      );

    case "cta":
      return (
        <section className="bg-accent-surface px-5 py-20 text-center lg:px-8 lg:py-28">
          <div className={container}>
            <Reveal>
              <h2 className="text-balance mx-auto max-w-2xl font-serif text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.1] text-paper-light">
                {section.title}
              </h2>
              {section.text && (
                <p className="mx-auto mt-5 max-w-2xl text-lg text-paper/85">{section.text}</p>
              )}
              <div className="mt-9">
                <Button href={wa} external variant="light" size="lg">
                  Falar no WhatsApp
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      );
  }
}

export default function LandingPageView({
  page,
  preview = false,
}: {
  page: LandingPage;
  preview?: boolean;
}) {
  const wa = whatsappHref(page.hero.whatsappMessage);
  const video = page.hero.videoUrl ? youtubeId(page.hero.videoUrl) : null;
  const hasMedia = Boolean(video || page.hero.image);

  return (
    <>
      {preview && (
        <p className="bg-gold px-5 py-2 text-center text-sm font-medium text-ink">
          Pré-visualização{page.status === "rascunho" ? " de rascunho: esta página ainda não está no ar" : ""}.
        </p>
      )}

      {/* Hero — fundo azul-tinta, como a home */}
      <section className="bg-ink px-5 pb-16 pt-28 lg:px-8 lg:pb-24 lg:pt-32">
        <div className={container}>
          <Breadcrumbs
            items={[
              { label: "Áreas de Atuação", href: "/areas-de-atuacao" },
              { label: page.name },
            ]}
            light
          />
          <div
            className={`grid items-center gap-10 ${
              hasMedia ? "lg:grid-cols-[1.1fr_1fr]" : ""
            }`}
          >
            <Reveal>
              {page.hero.eyebrow && (
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-gold">
                  {page.hero.eyebrow}
                </p>
              )}
              <h1 className="text-balance font-serif text-[clamp(2.5rem,4.5vw,4.25rem)] font-medium leading-[1.05] tracking-[-0.015em] text-paper-light">
                {page.hero.title}
              </h1>
              <p className="mt-6 max-w-xl text-lg text-pretty text-paper/75">
                {page.hero.subtitle}
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Button href={wa} external variant="light" size="lg">
                  {page.hero.ctaLabel}
                </Button>
                {page.fechamento.formulario && (
                  <Button href="#contato" variant="ghost-light" size="lg">
                    Enviar mensagem
                  </Button>
                )}
              </div>
            </Reveal>
            {hasMedia && (
              <Reveal delay={0.15}>
                {video ? (
                  <div className="overflow-hidden rounded-md border border-paper/15 bg-black">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${video}?rel=0`}
                      title={page.hero.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="aspect-video w-full"
                    />
                  </div>
                ) : (
                  <Photo
                    src={page.hero.image!.src}
                    alt={page.hero.image!.alt}
                    ratio="4/3"
                    preload
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                )}
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {page.sections.map((section, i) => (
        <Section key={section.id} section={section} index={i} wa={wa} />
      ))}

      {/* Fechamento — formulário com o assunto já marcado */}
      <section id="contato" className="px-5 pb-28 pt-20 lg:px-8 lg:pb-36 lg:pt-28">
        <div className={container}>
          <Reveal>
            <SectionHeading title={page.fechamento.title} description={page.fechamento.text} />
          </Reveal>
          <div className="mt-12 grid gap-12 lg:grid-cols-2">
            {page.fechamento.formulario ? (
              <Reveal>
                <ContactForm assuntoInicial={page.name} origem={page.slug} />
              </Reveal>
            ) : (
              <Reveal>
                <Button href={wa} external size="lg">
                  {page.hero.ctaLabel}
                </Button>
              </Reveal>
            )}
            <Reveal delay={0.1}>
              <ul className="space-y-6 text-ink">
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
                  <a href={site.emailHref} className="mt-1 inline-block text-lg font-medium break-words hover:text-accent-deep">
                    {site.email}
                  </a>
                </li>
                <li>
                  <p className="label">Atendimento</p>
                  <p className="mt-1 text-lg">Presencial na sede ou remoto, em todo o Brasil.</p>
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
