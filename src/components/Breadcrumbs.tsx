import Link from "next/link";

export type Crumb = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: Crumb[];
  /** Cores claras para uso sobre fundos escuros (heros coloridos). */
  light?: boolean;
};

/**
 * Trilha de navegação — presente em todas as páginas internas.
 * Padrão: Home > Seção > Página atual (último item sem link).
 */
export default function Breadcrumbs({ items, light = false }: BreadcrumbsProps) {
  const crumbs: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  const linkCls = light
    ? "transition-colors text-paper/70 hover:text-paper-light"
    : "transition-colors hover:text-accent-deep";
  const currentCls = light ? "text-paper-light" : "text-ink";
  const sepCls = light ? "text-paper/40" : "text-line";
  return (
    <nav
      aria-label="Trilha de navegação"
      className={`mb-10 ${light ? "text-paper/70" : ""}`}
    >
      <ol className="flex flex-wrap items-center gap-1.5 text-base text-ink-soft">
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
              {crumb.href && !last ? (
                <Link href={crumb.href} className={linkCls}>
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current="page" className={currentCls}>
                  {crumb.label}
                </span>
              )}
              {!last && (
                <span aria-hidden className={sepCls}>
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
