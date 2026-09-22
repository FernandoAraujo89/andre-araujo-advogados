import { notFound, redirect } from "next/navigation";
import SiteChrome from "@/components/SiteChrome";
import LandingPageView from "@/components/landing/LandingPageView";
import { isAdmin } from "@/lib/admin-guard";
import { getLandingPage } from "@/lib/landing";
import { getFounder } from "@/lib/equipe";

type Props = { params: Promise<{ slug: string }> };

// Sempre dinâmico: depende da sessão e mostra o que está salvo agora.
export const dynamic = "force-dynamic";

/**
 * Pré-visualização de uma landing page (rascunho ou não) com o chrome do
 * site, só para quem está logado no painel. Fica fora do grupo (painel) para
 * não herdar a coluna estreita do painel.
 */
export default async function PreviewLandingPage({ params }: Props) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { slug } = await params;
  const page = await getLandingPage(slug);
  if (!page) notFound();
  return (
    <SiteChrome>
      <LandingPageView page={page} preview founder={await getFounder()} />
    </SiteChrome>
  );
}
