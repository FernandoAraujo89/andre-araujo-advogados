type PhotoPlaceholderProps = {
  /** Descrição da foto real que deve substituir este placeholder */
  label: string;
  /** Iniciais para o monograma (ex.: "AA") — usado nos retratos da equipe */
  initials?: string;
  /** Proporção CSS, ex.: "4/5", "1/1", "4/3" */
  ratio?: string;
  className?: string;
  rounded?: string;
};

/**
 * Placeholder de fotografia em tons da paleta, com proporção fixa (CLS zero).
 * Com `initials`, vira um monograma serifado — usado para os retratos da
 * equipe até as fotos reais chegarem (não usamos banco de imagens para
 * rostos de pessoas nomeadas).
 */
export default function PhotoPlaceholder({
  label,
  initials,
  ratio = "4/3",
  className = "",
  rounded = "rounded-md",
}: PhotoPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative flex w-full items-center justify-center overflow-hidden bg-accent-mist ${rounded} ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {initials ? (
        <span className="select-none font-serif text-[clamp(3rem,8vw,5rem)] font-medium text-accent/70">
          {initials}
        </span>
      ) : (
        <span className="max-w-[22ch] px-6 text-center text-[0.9375rem] leading-snug text-ink-soft/70">
          {label}
        </span>
      )}
    </div>
  );
}
