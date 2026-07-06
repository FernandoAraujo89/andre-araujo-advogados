import { site } from "@/data/site";

/**
 * Card lateral de conversão — fixo no desktop nas páginas de área e de nicho.
 */
export default function ContactAside() {
  return (
    <aside className="lg:sticky lg:top-28">
      <div className="rounded-md bg-ink p-8 text-paper/85">
        <h2 className="font-serif text-2xl font-medium text-paper-light">
          Converse com o escritório
        </h2>
        <p className="mt-3 text-[0.9375rem] leading-relaxed">
          Explique sua situação e entenda os caminhos possíveis. Atendimento em
          Formiga e região.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <a
            href={site.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-paper px-6 py-3.5 font-medium text-ink transition-all duration-300 hover:scale-[1.02] hover:bg-paper-light"
          >
            Falar no WhatsApp
          </a>
          <a
            href={site.phoneHref}
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-paper/30 px-6 py-3.5 font-medium text-paper-light transition-colors hover:border-paper-light hover:bg-paper/10"
          >
            {site.phone}
          </a>
        </div>
      </div>
    </aside>
  );
}
