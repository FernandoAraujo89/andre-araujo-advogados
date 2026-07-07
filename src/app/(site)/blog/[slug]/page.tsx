import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Reveal from "@/components/Reveal";
import Photo from "@/components/Photo";
import PostCard from "@/components/PostCard";
import ContactAside from "@/components/ContactAside";
import SectionHeading from "@/components/SectionHeading";
import Markdown from "@/components/Markdown";
import JsonLd from "@/components/JsonLd";
import { formatDate } from "@/data/posts";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { articleJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

// Gera as páginas conhecidas no build; posts criados depois são renderizados
// sob demanda (dynamicParams padrão = true) e revalidados ao publicar.
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.image?.src,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.updatedAt,
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const all = await getAllPosts();
  const related = all
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  return (
    <div className="px-5 pb-28 pt-36 lg:px-8 lg:pb-36">
      <JsonLd data={articleJsonLd(post)} />
      <div className="mx-auto max-w-[1240px]">
        <Breadcrumbs
          items={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
        />

        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          <article>
            <Reveal>
              <p className="label mb-3 text-wine">{post.category}</p>
              <h1 className="max-w-3xl font-serif text-[clamp(2.25rem,4.5vw,3.5rem)] font-medium leading-[1.1] text-ink">
                {post.title}
              </h1>
              <time dateTime={post.date} className="mt-5 block text-ink-soft">
                {formatDate(post.date)}
              </time>
              {post.image && (
                <div className="mt-8">
                  <Photo
                    src={post.image.src}
                    alt={post.image.alt}
                    ratio="16/9"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    preload
                    credit={post.image.credit}
                    creditUrl={post.image.creditUrl}
                  />
                </div>
              )}
            </Reveal>

            <div className="mt-10 max-w-3xl">
              <Markdown>{post.body}</Markdown>
            </div>

            <Reveal>
              <p className="mt-12 max-w-3xl rounded-md border border-line bg-paper-light p-6 text-base text-ink-soft">
                Este conteúdo tem caráter informativo e não substitui a análise
                do seu caso concreto. Para orientação específica, fale com o
                escritório.
              </p>
            </Reveal>
          </article>

          <ContactAside />
        </div>

        {related.length > 0 && (
          <div className="mt-24">
            <Reveal>
              <SectionHeading title="Artigos relacionados" />
            </Reveal>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.08} className="h-full">
                  <PostCard post={p} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
