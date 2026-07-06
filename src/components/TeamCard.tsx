import Link from "next/link";
import PhotoPlaceholder from "./PhotoPlaceholder";
import { initialsOf, type Lawyer } from "@/data/team";

type TeamCardProps = {
  lawyer: Lawyer;
};

export default function TeamCard({ lawyer }: TeamCardProps) {
  return (
    <Link
      href={`/equipe/${lawyer.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-md border border-line bg-paper-light transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(22,34,44,0.12)]"
    >
      {/* TODO: substituir por foto real padronizada (proporção 4:5) via next/image */}
      <PhotoPlaceholder
        label={`Foto de ${lawyer.name}`}
        initials={initialsOf(lawyer.name)}
        ratio="4/5"
        rounded="rounded-none"
      />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-lg font-medium leading-snug text-ink">
          {lawyer.name}
        </h3>
        <p className="mt-1 text-sm text-ink-soft">{lawyer.role}</p>
        <p className="mt-1 text-sm text-ink-soft">{lawyer.oab}</p>
        <span className="mt-4 text-sm font-medium text-wine-deep">
          Ver perfil
        </span>
      </div>
    </Link>
  );
}
