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

// Renderização dinâmica: o post é lido do Blob a cada requisição, então
// publicar, editar ou excluir reflete no ar na hora e sempre correto.
// Continua SSR (HTML completo para SEO); custo desprezível no volume do blog.
export const dynamic = "force-dynamic";

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
    <div className="px-5 pb-28 pt-36 md:px-10 xl:px-16 lg:pb-48 lg:pt-48">
      <JsonLd data={articleJsonLd(post)} />
      <div className="mx-auto max-w-[1240px]">
        <Breadcrumbs
          items={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
        />

        <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-20">
          <article>
            <Reveal>
              <p className="label mb-4 text-accent">{post.category}</p>
              <h1 className="max-w-3xl text-balance text-heading text-ink">
                {post.title}
              </h1>
              <time dateTime={post.date} className="mt-6 block text-ink-soft">
                {formatDate(post.date)}
              </time>
              {post.image && (
                <div className="mt-10 lg:mt-12">
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

            <div className="mt-12 max-w-3xl lg:mt-14">
              <Markdown>{post.body}</Markdown>
            </div>

            <Reveal>
              <p className="mt-14 max-w-3xl rounded-md border border-line bg-paper-light p-6 text-base text-ink-soft lg:p-8">
                Este conteúdo tem caráter informativo e não substitui a análise
                do seu caso concreto. Para orientação específica, fale com o
                escritório.
              </p>
            </Reveal>
          </article>

          <ContactAside />
        </div>

        {related.length > 0 && (
          <div className="mt-28 lg:mt-44">
            <Reveal>
              <SectionHeading title="Artigos relacionados" />
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-3 lg:mt-16 lg:gap-8">
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
