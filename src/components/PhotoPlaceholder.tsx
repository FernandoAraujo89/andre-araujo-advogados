import { Scale } from "lucide-react";

type PhotoPlaceholderProps = {
  /** Descrição da foto real que deve substituir este placeholder */
  label: string;
  /** Proporção CSS, ex.: "4/5", "1/1", "4/3" */
  ratio?: string;
  className?: string;
  rounded?: string;
};

/**
 * Placeholder de fotografia em tons da paleta, com proporção fixa (CLS zero).
 * TODO: substituir cada uso por foto real via next/image — o `label`
 * indica qual foto entra em cada posição.
 */
export default function PhotoPlaceholder({
  label,
  ratio = "4/3",
  className = "",
  rounded = "rounded-[1.75rem]",
}: PhotoPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative flex w-full items-center justify-center overflow-hidden bg-[#E9E2D3] ${rounded} ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <div className="flex flex-col items-center gap-3 px-6 text-center">
        <Scale className="h-8 w-8 text-brass/60" strokeWidth={1.25} aria-hidden />
        <span className="max-w-[22ch] text-[0.8125rem] leading-snug text-ink-soft/70">
          {label}
        </span>
      </div>
    </div>
  );
}
