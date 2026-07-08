import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { googleReviews } from "@/data/reviews";

/** Estrelas em ouro (decorativas — a nota vai no aria-label do contêiner). */
function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={`${rating.toLocaleString("pt-BR")} de 5 estrelas`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`h-[1.125rem] w-[1.125rem] ${i < full ? "fill-gold" : "fill-line"}`}
          aria-hidden="true"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

/** Logotipo "G" do Google (4 cores) — sinaliza a origem das avaliações. */
function GoogleG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

export default function GoogleReviews() {
  const { rating, count, reviews, url } = googleReviews;

  return (
    <section
      aria-labelledby="avaliacoes-titulo"
      className="border-y border-line bg-paper-light px-5 py-24 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-[1240px]">
        {/* Cabeçalho: título + resumo da nota do Google */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <div id="avaliacoes-titulo">
              <SectionHeading
                title="O que dizem nossos clientes"
                description="Avaliações reais publicadas no Google por quem foi atendido pelo escritório."
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex items-center gap-5 rounded-md border border-line bg-paper px-6 py-5">
              <span className="font-serif text-[3.25rem] font-medium leading-none text-ink">
                {rating.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}
              </span>
              <span aria-hidden className="h-12 w-px bg-line" />
              <div>
                <Stars rating={rating} />
                <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-soft">
                  <GoogleG className="h-4 w-4" />
                  {count} avaliações no Google
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Cards das avaliações */}
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal key={review.name} delay={i * 0.08} className="h-full">
              <li className="h-full">
                <figure className="flex h-full flex-col rounded-md border border-line bg-paper p-8">
                  <Stars rating={review.rating} />
                  <blockquote className="mt-5 flex-1 text-pretty text-[1.0625rem] leading-relaxed text-ink-soft">
                    {review.text}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                    <span
                      aria-hidden
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-mist font-medium text-accent-deep"
                    >
                      {review.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-ink">
                        {review.name}
                      </span>
                      <span className="block text-sm text-ink-soft">
                        {review.date}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal>
          <div className="mt-10">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-sm border border-ink/25 px-6 py-3 text-[0.9375rem] font-medium text-ink transition-colors hover:border-accent hover:text-accent-deep"
            >
              <GoogleG className="h-[1.125rem] w-[1.125rem]" />
              Ver todas as {count} avaliações no Google
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
