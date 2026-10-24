import Image from "next/image";
import type { ComponentType, ElementType, ReactNode } from "react";
import Button, { type ButtonVariant } from "@/components/Button";
import { isExternalHref, type LpButton, type LpImage, type LpSection } from "@/data/landing";

/**
 * "Kit" de peças da landing page. A mesma árvore de componentes
 * (LandingPageView) serve ao site e ao editor visual do painel: cada texto,
 * imagem, botão, item de lista e seção passa por uma destas peças. O site usa
 * o kit estático abaixo (sem estado, renderizável no servidor); o editor
 * troca pelo kit editável (src/components/admin/landing-editor), que deixa
 * clicar e alterar cada elemento no lugar.
 *
 * `path` aponta o valor dentro da página, ex.: ["hero", "title"] ou
 * ["sections", 2, "items", 0, "title"].
 */

export type LpPath = (string | number)[];

export type TextSlotProps = {
  path: LpPath;
  value: string;
  as?: ElementType;
  className?: string;
  /** Aceita quebras de linha (parágrafos) */
  multiline?: boolean;
  /** Texto de ajuda do editor quando o campo está vazio */
  placeholder?: string;
};

export type ImageSlotProps = {
  path: LpPath;
  value: LpImage;
  /** Classes da <Image> (object-fit/position); o pai precisa ser `relative` */
  className?: string;
  sizes: string;
  preload?: boolean;
  /** Orientação para quem troca a imagem no editor */
  hint?: string;
};

export type ButtonSlotProps = {
  path: LpPath;
  value: LpButton;
  href: string;
  variant: ButtonVariant;
  size?: "md" | "lg";
  className?: string;
};

export type ItemSlotProps = {
  /** Caminho da lista que contém o item */
  list: LpPath;
  index: number;
  count: number;
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

export type AddSlotProps = {
  list: LpPath;
  count: number;
  make: () => unknown;
  label: string;
  className?: string;
};

export type SectionSlotProps = {
  index: number;
  section: LpSection;
  children: ReactNode;
};

export type LandingKit = {
  editing: boolean;
  Text: ComponentType<TextSlotProps>;
  Img: ComponentType<ImageSlotProps>;
  Btn: ComponentType<ButtonSlotProps>;
  Item: ComponentType<ItemSlotProps>;
  Add: ComponentType<AddSlotProps>;
  Section: ComponentType<SectionSlotProps>;
};

/**
 * Imagens que o next/image pode otimizar: arquivos do site, as do painel
 * (/imagens/<id>, no banco) e os hosts liberados no next.config. Qualquer
 * outra URL colada no editor é exibida como veio.
 */
export function canOptimize(src: string): boolean {
  return (
    (src.startsWith("/") && !src.startsWith("//")) ||
    src.startsWith("https://images.unsplash.com/")
  );
}

/** Imagem preenchendo o pai (`relative`), com a URL que vier do painel. */
export function LpPicture({
  value,
  className = "object-cover",
  sizes,
  preload,
}: {
  value: LpImage;
  className?: string;
  sizes: string;
  preload?: boolean;
}) {
  if (!value.src) return null;
  return (
    <Image
      src={value.src}
      alt={value.alt}
      fill
      sizes={sizes}
      preload={preload}
      unoptimized={!canOptimize(value.src)}
      className={className}
    />
  );
}

/* Kit estático: o que o visitante do site vê. */

function StaticText({ value, as: Tag = "span", className = "", multiline }: TextSlotProps) {
  if (!value) return null;
  return (
    <Tag className={`${className} ${multiline ? "whitespace-pre-line" : ""}`}>{value}</Tag>
  );
}

function StaticImg({ value, className, sizes, preload }: ImageSlotProps) {
  return <LpPicture value={value} className={className} sizes={sizes} preload={preload} />;
}

function StaticBtn({ value, href, variant, size = "lg", className }: ButtonSlotProps) {
  if (!value.label) return null;
  return (
    <Button
      href={href}
      external={isExternalHref(href)}
      variant={variant}
      size={size}
      className={className}
    >
      {value.label}
    </Button>
  );
}

function StaticItem({ as: Tag = "div", className, children }: ItemSlotProps) {
  return <Tag className={className}>{children}</Tag>;
}

function StaticAdd() {
  return null;
}

function StaticSection({ section, children }: SectionSlotProps) {
  return section.hidden ? null : <>{children}</>;
}

export const staticKit: LandingKit = {
  editing: false,
  Text: StaticText,
  Img: StaticImg,
  Btn: StaticBtn,
  Item: StaticItem,
  Add: StaticAdd,
  Section: StaticSection,
};
