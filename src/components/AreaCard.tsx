import Image from "next/image";
import Link from "next/link";
import type { Area } from "@/data/areas";
import { areaImages } from "@/data/area-images";

type AreaCardProps = {
  /** `href` opcional para áreas fora de /areas-de-atuacao (ex.: servidor público) */
  area: Pick<Area, "slug" | "name" | "tagline"> & { href?: string };
  /** Número editorial exibido no topo do card (01, 02…) */
  index?: number;
  /** Card ocupando a linha inteira (o último da grade): foto à esquerda em lg+ */
  wide?: boolean;
  className?: string;
};

export default function AreaCard({
  area,
  index,
  wide = false,
  className = "",
}: AreaCardProps) {
  const image = areaImages[area.slug];

  return (
    <Link
      href={area.href ?? `/areas-de-atuacao/${area.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-md border border-line bg-paper-light transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_18px_50px_rgba(22,34,44,0.12)] ${
        wide ? "lg:flex-row" : ""
      } ${className}`}
    >
      {image && (
        /*
         * Faixa fotográfica: em repouso a foto fica em monocromático quente
         * (cinza + sépia sob um véu bronze), na paleta creme da página e sem
         * competir com o texto; no hover/foco do card ela recupera a cor e
         * avança um pouco. O contraste extra em repouso evita que as fotos,
         * todas de luz alta, pareçam lavadas. `alt` vazio de propósito — a
         * imagem é ilustrativa e o link já é nomeado pelo título.
         */
        <div
          className={`relative aspect-[16/9] w-full shrink-0 overflow-hidden border-b border-line bg-paper ${
            wide ? "lg:aspect-auto lg:w-[42%] lg:border-b-0 lg:border-r" : ""
          }`}
        >
          <Image
            src={image}
            alt=""
            fill
            sizes={
              wide
                ? "(min-width: 1024px) 520px, (min-width: 640px) 50vw, 100vw"
                : "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            }
            className={[
              "object-cover transition duration-700 ease-out",
              // repouso: monocromático quente, um pouco mais denso que o original
              "grayscale sepia-[45%] contrast-[120%] brightness-[90%]",
              // hover/foco: a foto recupera a cor e avança
              "group-hover:scale-[1.04] group-hover:grayscale-0 group-hover:sepia-0 group-hover:contrast-[105%] group-hover:brightness-100",
              "group-focus-visible:scale-[1.04] group-focus-visible:grayscale-0 group-focus-visible:sepia-0 group-focus-visible:contrast-[105%] group-focus-visible:brightness-100",
              "motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100",
            ].join(" ")}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-accent/10 transition-opacity duration-700 ease-out group-hover:opacity-0 group-focus-visible:opacity-0"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-8 lg:p-10">
        {index !== undefined && (
          <p aria-hidden className="font-serif text-lg italic text-accent">
            {String(index).padStart(2, "0")}
          </p>
        )}
        <h3
          className={`text-card text-ink ${
            index !== undefined ? "mt-4 border-t border-line pt-5" : ""
          }`}
        >
          {area.name}
        </h3>
        <p className="mt-4 flex-1 text-[0.9375rem] text-ink-soft">
          {area.tagline}
        </p>
        <span className="mt-8 text-[0.9375rem] font-medium text-accent-deep">
          Saiba mais
        </span>
      </div>
    </Link>
  );
}
