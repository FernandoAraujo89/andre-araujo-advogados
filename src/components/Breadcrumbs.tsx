import Link from "next/link";

export type Crumb = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: Crumb[];
};

/**
 * Trilha de navegação — presente em todas as páginas internas.
 * Padrão: Home > Seção > Página atual (último item sem link).
 */
export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const crumbs: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  return (
    <nav aria-label="Trilha de navegação" className="mb-10">
      <ol className="flex flex-wrap items-center gap-1.5 text-base text-ink-soft">
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
              {crumb.href && !last ? (
                <Link
                  href={crumb.href}
                  className="transition-colors hover:text-wine-deep"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-ink">
                  {crumb.label}
                </span>
              )}
              {!last && (
                <span aria-hidden className="text-line">
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
