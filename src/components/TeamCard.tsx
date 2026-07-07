import Link from "next/link";
import Photo from "./Photo";
import PhotoPlaceholder from "./PhotoPlaceholder";
import { initialsOf, type TeamMember } from "@/data/team";

type TeamCardProps = {
  member: TeamMember;
};

export default function TeamCard({ member }: TeamCardProps) {
  const inner = (
    <>
      {member.photo ? (
        <Photo
          src={member.photo}
          alt={`Foto de ${member.name}`}
          ratio="1/1"
          rounded="rounded-none"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      ) : (
        <PhotoPlaceholder
          label={`Foto de ${member.name}`}
          initials={initialsOf(member.name)}
          ratio="1/1"
          rounded="rounded-none"
        />
      )}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-lg font-medium leading-snug text-ink">
          {member.name}
        </h3>
        <p className="mt-1 flex-1 text-base text-ink-soft">
          {[member.role, member.oab].filter(Boolean).join(", ")}
        </p>
        {member.hasProfile && (
          <span className="mt-4 text-base font-medium text-wine-deep">
            Ver perfil
          </span>
        )}
      </div>
    </>
  );

  const cardCls =
    "flex h-full flex-col overflow-hidden rounded-md border border-line bg-paper-light";

  if (!member.hasProfile) {
    return <div className={cardCls}>{inner}</div>;
  }

  return (
    <Link
      href={`/equipe/${member.slug}`}
      className={`group ${cardCls} transition-all duration-300 hover:-translate-y-1 hover:border-wine hover:shadow-[0_18px_50px_rgba(22,34,44,0.12)]`}
    >
      {inner}
    </Link>
  );
}
