import { notFound } from "next/navigation";
import LandingEditor from "@/components/admin/LandingEditor";
import { getLandingPage } from "@/lib/landing";

type Props = { params: Promise<{ slug: string }> };

export default async function EditarLandingPage({ params }: Props) {
  const { slug } = await params;
  const page = await getLandingPage(slug);
  if (!page) notFound();
  return <LandingEditor mode="edit" initial={page} />;
}
