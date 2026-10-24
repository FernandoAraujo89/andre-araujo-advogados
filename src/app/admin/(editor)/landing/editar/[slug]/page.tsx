import { notFound } from "next/navigation";
import VisualEditor from "@/components/admin/landing-editor/VisualEditor";
import { getAllPosts } from "@/lib/blog";
import { getTeam } from "@/lib/equipe";
import { getLandingPage, landingStorageEnabled } from "@/lib/landing";

type Props = { params: Promise<{ slug: string }> };

export default async function EditarLandingPage({ params }: Props) {
  const { slug } = await params;
  const [page, team, posts] = await Promise.all([getLandingPage(slug), getTeam(), getAllPosts()]);
  if (!page) notFound();
  return (
    <VisualEditor
      key={page.slug}
      initial={page}
      originalSlug={page.slug}
      team={team}
      posts={posts}
      storageEnabled={landingStorageEnabled()}
    />
  );
}
