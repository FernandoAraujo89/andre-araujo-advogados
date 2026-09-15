import type { ReactNode } from "react";

type SectionHeadingProps = {
  /** Aceita <em> para o acento em serifa itálica (ver globals.css) */
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  dark?: boolean;
};

export default function SectionHeading({
  title,
  description,
  align = "left",
  as: Tag = "h2",
  dark = false,
}: SectionHeadingProps) {
  const center = align === "center";
  // Título largo e texto de apoio estreito: o contraste de medidas abre o
  // espaço vazio ao redor, como na referência editorial.
  const titleCls =
    Tag === "h1" ? "max-w-5xl text-display" : "max-w-4xl text-heading";
  return (
    <div className={center ? "text-center" : ""}>
      <Tag
        className={`text-balance ${titleCls} ${
          center ? "mx-auto" : ""
        } ${dark ? "text-paper-light" : "text-ink"}`}
      >
        {title}
      </Tag>
      {description && (
        <p
          className={`mt-6 max-w-2xl text-lg text-pretty lg:mt-8 ${
            center ? "mx-auto" : ""
          } ${dark ? "text-paper/75" : "text-ink-soft"}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
