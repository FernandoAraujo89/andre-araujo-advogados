import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-guard";

// Sempre dinâmico: depende da sessão (cookies).
export const dynamic = "force-dynamic";

/**
 * Telas de edição em página inteira (editor visual das landing pages). Fora
 * do grupo (painel) para não herdar a coluna estreita nem o cabeçalho do
 * painel: o editor tem a própria barra.
 */
export default async function EditorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Verificação definitiva (o proxy já barra, isto é defesa em profundidade).
  if (!(await isAdmin())) redirect("/admin/login");
  return children;
}
