import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AreaIcon from "./AreaIcon";
import type { Area } from "@/data/areas";

type AreaCardProps = {
  area: Pick<Area, "slug" | "name" | "icon" | "tagline">;
};

export default function AreaCard({ area }: AreaCardProps) {
  return (
    <Link
      href={`/areas-de-atuacao/${area.slug}`}
      className="group flex h-full flex-col rounded-[1.75rem] border border-line bg-paper-light p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(22,34,44,0.12)]"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper text-brass">
        <AreaIcon name={area.icon} className="h-6 w-6" />
      </span>
      <h3 className="mt-6 font-serif text-xl font-medium text-ink">
        {area.name}
      </h3>
      <p className="mt-3 flex-1 text-[0.9375rem] text-ink-soft">
        {area.tagline}
      </p>
      <span className="mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-brass-deep">
        Saiba mais
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
          strokeWidth={1.5}
          aria-hidden
        />
      </span>
    </Link>
  );
}
