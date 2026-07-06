import Image from "next/image";

type PhotoProps = {
  src: string;
  alt: string;
  /** Proporção CSS, ex.: "4/5", "4/3", "16/10" */
  ratio?: string;
  className?: string;
  rounded?: string;
  sizes?: string;
  priority?: boolean;
  /** Crédito do fotógrafo (Unsplash) — exibido sobre a imagem */
  credit?: string;
  creditUrl?: string;
};

/**
 * Fotografia com proporção fixa (CLS zero) via next/image.
 * Imagens do Unsplash exigem crédito visível — passe `credit`/`creditUrl`
 * nas imagens de destaque (hero, capas internas).
 */
export default function Photo({
  src,
  alt,
  ratio = "4/3",
  className = "",
  rounded = "rounded-md",
  sizes = "(max-width: 1024px) 100vw, 50vw",
  priority = false,
  credit,
  creditUrl,
}: PhotoProps) {
  return (
    <div
      className={`relative w-full overflow-hidden ${rounded} ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
      {credit && (
        <a
          href={creditUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 rounded-sm bg-ink/70 px-2 py-1 text-[0.6875rem] leading-none text-paper-light"
        >
          {credit}
        </a>
      )}
    </div>
  );
}
