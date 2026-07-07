import Link from "next/link";
import Photo from "./Photo";
import { formatDate, type Post } from "@/data/posts";

type PostCardProps = {
  post: Post;
};

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-md border border-line bg-paper-light transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(22,34,44,0.12)]"
    >
      {post.image ? (
        <Photo
          src={post.image.src}
          alt={post.image.alt}
          ratio="16/10"
          rounded="rounded-none"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      ) : (
        <div
          aria-hidden
          className="flex items-center justify-center bg-wine-mist"
          style={{ aspectRatio: "16/10" }}
        >
          <span className="font-serif text-2xl font-medium text-wine/40">
            AA
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <span className="label mb-2 text-wine">{post.category}</span>
        <h3 className="flex-1 font-serif text-lg font-medium leading-snug text-ink transition-colors group-hover:text-wine-deep">
          {post.title}
        </h3>
        <time dateTime={post.date} className="mt-4 text-base text-ink-soft">
          {formatDate(post.date)}
        </time>
      </div>
    </Link>
  );
}
