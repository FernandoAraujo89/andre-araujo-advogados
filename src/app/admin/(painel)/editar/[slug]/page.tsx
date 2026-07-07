import { notFound } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";
import { getPostBySlug } from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

export default async function EditarPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  return <PostEditor mode="edit" initial={post} />;
}
