import Link from "next/link";
import PhotoPlaceholder from "./PhotoPlaceholder";
import { formatDate, type Post } from "@/data/posts";

type PostCardProps = {
  post: Post;
};

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-paper-light transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(22,34,44,0.12)]"
    >
      {/* TODO: substituir por imagem de capa real do post via next/image */}
      <PhotoPlaceholder
        label={`Imagem de capa: ${post.title}`}
        ratio="16/10"
        rounded="rounded-none"
      />
      <div className="flex flex-1 flex-col p-6">
        <span className="eyebrow text-xs">{post.category}</span>
        <h3 className="mt-3 flex-1 font-serif text-lg font-medium leading-snug text-ink transition-colors group-hover:text-brass-deep">
          {post.title}
        </h3>
        <time dateTime={post.date} className="mt-4 text-sm text-ink-soft">
          {formatDate(post.date)}
        </time>
      </div>
    </Link>
  );
}
