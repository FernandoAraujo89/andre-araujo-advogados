import Link from "next/link";
import type { Area } from "@/data/areas";

type AreaCardProps = {
  /** `href` opcional para áreas fora de /areas-de-atuacao (ex.: servidor público) */
  area: Pick<Area, "slug" | "name" | "tagline"> & { href?: string };
  /** Número editorial exibido no topo do card (01, 02…) */
  index?: number;
  className?: string;
};

export default function AreaCard({ area, index, className = "" }: AreaCardProps) {
  return (
    <Link
      href={area.href ?? `/areas-de-atuacao/${area.slug}`}
      className={`group flex h-full flex-col rounded-md border border-line bg-paper-light p-8 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_18px_50px_rgba(22,34,44,0.12)] lg:p-10 ${className}`}
    >
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
    </Link>
  );
}
