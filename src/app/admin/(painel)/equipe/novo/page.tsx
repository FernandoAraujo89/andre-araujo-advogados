import TeamEditor from "@/components/admin/TeamEditor";
import { getTeam } from "@/lib/equipe";

export default async function NovoIntegrantePage() {
  const members = await getTeam();
  const setoresEmUso = [...new Set(members.map((m) => m.setor).filter(Boolean))] as string[];
  return <TeamEditor mode="create" setoresEmUso={setoresEmUso} />;
}
