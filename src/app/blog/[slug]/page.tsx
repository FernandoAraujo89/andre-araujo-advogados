import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Reveal from "@/components/Reveal";
import Photo from "@/components/Photo";
import PostCard from "@/components/PostCard";
import ContactAside from "@/components/ContactAside";
import SectionHeading from "@/components/SectionHeading";
import { posts, getPost, formatDate } from "@/data/posts";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = posts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  return (
    <div className="px-5 pb-28 pt-36 lg:px-8 lg:pb-36">
      <div className="mx-auto max-w-[1240px]">
        <Breadcrumbs
          items={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
        />

        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          <article>
            <Reveal>
              <h1 className="max-w-3xl font-serif text-[clamp(2.25rem,4.5vw,3.5rem)] font-medium leading-[1.1] text-ink">
                {post.title}
              </h1>
              <time dateTime={post.date} className="mt-5 block text-ink-soft">
                {formatDate(post.date)}
              </time>
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
            </Reveal>

            <div className="mt-10 max-w-3xl space-y-10">
              {post.sections.map((section, i) => (
                <Reveal key={i}>
                  {section.heading && (
                    <h2 className="mb-4 font-serif text-2xl font-medium text-ink lg:text-3xl">
                      {section.heading}
                    </h2>
                  )}
                  <div className="space-y-5">
                    {section.paragraphs.map((p, j) => (
                      <p key={j} className="text-lg text-ink-soft">
                        {p}
                      </p>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <p className="mt-12 max-w-3xl rounded-md border border-line bg-paper-light p-6 text-[0.9375rem] text-ink-soft">
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
