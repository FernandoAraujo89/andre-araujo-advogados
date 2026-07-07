import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import FaqAccordion from "@/components/FaqAccordion";
import ContactAside from "@/components/ContactAside";
import { servidorPages, servidoresIntro } from "@/data/servidores";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Direito do Servidor Público",
  description:
    "Orientação jurídica a servidores públicos de MG em Formiga, MG: férias-prêmio, progressão e promoção, adicional noturno e vale-transporte.",
  path: "/servidores-publicos",
});

export default function ServidoresPage() {
  const allFaq = servidorPages.flatMap((p) => p.faq).slice(0, 6);

  return (
    <>
      {/* Hero — fundo forte do mundo Servidor Público (vinho) */}
      <section className="bg-wine px-5 pb-16 pt-28 lg:px-8 lg:pb-20 lg:pt-32">
        <div className="mx-auto max-w-[1240px]">
          <Breadcrumbs
            items={[{ label: "Direito do Servidor Público" }]}
            light
          />
          <Reveal>
            <SectionHeading
              as="h1"
              dark
              title={servidoresIntro.title}
              description={servidoresIntro.description}
            />
          </Reveal>
        </div>
      </section>

      {/* Conteúdo */}
      <div className="px-5 pb-28 pt-16 lg:px-8 lg:pb-36">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
            <div>
            <div className="grid gap-6 sm:grid-cols-2">
              {servidorPages.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 2) * 0.08} className="h-full">
                  <Link
                    href={`/servidores-publicos/${p.slug}`}
                    className="group flex h-full flex-col rounded-md border border-line bg-paper-light p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(22,34,44,0.12)]"
                  >
                    <h2 className="font-serif text-xl font-medium text-ink">
                      {p.name}
                    </h2>
                    <p className="mt-3 flex-1 text-[0.9375rem] text-ink-soft">
                      {p.problem.paragraphs[0].slice(0, 120)}...
                    </p>
                    <span className="mt-6 text-[0.9375rem] font-medium text-accent-deep">
                      Saiba mais
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <h2 className="mt-16 font-serif text-2xl font-medium text-ink lg:text-3xl">
                Perguntas frequentes
              </h2>
              <div className="mt-6">
                <FaqAccordion items={allFaq} />
              </div>
            </Reveal>
          </div>

          <ContactAside />
          </div>
        </div>
      </div>
    </>
  );
}
