import Link from "next/link";
import type { Area } from "@/data/areas";

type AreaCardProps = {
  area: Pick<Area, "slug" | "name" | "tagline">;
  /** Número editorial exibido no topo do card (01, 02…) */
  index?: number;
};

export default function AreaCard({ area, index }: AreaCardProps) {
  return (
    <Link
      href={`/areas-de-atuacao/${area.slug}`}
      className="group flex h-full flex-col rounded-md border border-line bg-paper-light p-8 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_18px_50px_rgba(22,34,44,0.12)]"
    >
      {index !== undefined && (
        <p aria-hidden className="font-serif text-sm italic text-accent">
          {String(index).padStart(2, "0")}
        </p>
      )}
      <h3
        className={`font-serif text-xl font-medium text-ink ${
          index !== undefined ? "mt-4 border-t border-line pt-4" : ""
        }`}
      >
        {area.name}
      </h3>
      <p className="mt-3 flex-1 text-[0.9375rem] text-ink-soft">
        {area.tagline}
      </p>
      <span className="mt-6 text-[0.9375rem] font-medium text-accent-deep">
        Saiba mais
      </span>
    </Link>
  );
}
