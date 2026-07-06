type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  dark?: boolean;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Tag = "h2",
  dark = false,
}: SectionHeadingProps) {
  const alignCls = align === "center" ? "text-center mx-auto" : "";
  const titleSize =
    Tag === "h1"
      ? "text-[clamp(2.75rem,6vw,4.75rem)]"
      : "text-[clamp(2rem,4vw,3rem)]";
  return (
    <div className={`max-w-3xl ${alignCls}`}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <Tag
        className={`font-serif font-medium leading-[1.1] tracking-[-0.01em] ${titleSize} ${
          dark ? "text-paper-light" : "text-ink"
        }`}
      >
        {title}
      </Tag>
      {description && (
        <p
          className={`mt-5 text-lg ${dark ? "text-paper/75" : "text-ink-soft"}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
