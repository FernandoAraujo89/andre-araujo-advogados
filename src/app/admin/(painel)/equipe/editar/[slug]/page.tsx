import { notFound } from "next/navigation";
import TeamEditor from "@/components/admin/TeamEditor";
import { getTeam, getTeamMember } from "@/lib/equipe";

type Props = { params: Promise<{ slug: string }> };

export default async function EditarIntegrantePage({ params }: Props) {
  const { slug } = await params;
  const member = await getTeamMember(slug);
  if (!member) notFound();

  const members = await getTeam();
  const setoresEmUso = [...new Set(members.map((m) => m.setor).filter(Boolean))] as string[];

  return <TeamEditor mode="edit" initial={member} setoresEmUso={setoresEmUso} />;
}
