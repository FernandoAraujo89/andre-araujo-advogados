import { redirect } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import { isAdmin } from "@/lib/admin-guard";

// Sempre dinâmico: depende da sessão (cookies).
export const dynamic = "force-dynamic";

export default async function PainelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Verificação definitiva (o proxy já barra, isto é defesa em profundidade).
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <>
      <AdminHeader />
      <main className="mx-auto max-w-[1080px] px-5 py-10">{children}</main>
    </>
  );
}
