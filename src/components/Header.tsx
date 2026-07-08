"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { site, worlds, type World } from "@/data/site";
import { areas } from "@/data/areas";
import { servidorPages } from "@/data/servidores";

type NavLink = { label: string; href: string };

/**
 * O topo abre pelas duas vertentes (Cível primeiro, Servidor depois). Cada uma
 * leva à sua página de vertente e revela as próprias SUBÁREAS num submenu
 * (dropdown no desktop, acordeão no menu mobile). As páginas institucionais
 * (O Escritório, Equipe, Contato) são acessadas pelos CTAs das seções na home.
 */
const verticals: {
  key: World;
  label: string;
  home: string;
  cols: 1 | 2;
  sections: NavLink[];
}[] = [
  {
    key: "civel",
    label: worlds.civel.label,
    home: worlds.civel.home,
    cols: 2,
    sections: areas.map((a) => ({
      label: a.name,
      href: `/areas-de-atuacao/${a.slug}`,
    })),
  },
  {
    key: "servidor",
    label: worlds.servidor.label,
    home: worlds.servidor.home,
    cols: 1,
    sections: servidorPages.map((p) => ({
      label: p.name,
      href: `/servidores-publicos/${p.slug}`,
    })),
  },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // A vertente ativa vem da rota (a home não destaca nenhuma).
  const activeWorld: World | null = pathname.startsWith("/servidores-publicos")
    ? "servidor"
    : pathname.startsWith("/areas-de-atuacao")
      ? "civel"
      : null;

  const [openWorld, setOpenWorld] = useState<World | null>(activeWorld);
  const closeMenu = () => setOpen(false);
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Linha principal — sólida para funcionar sobre os heros coloridos */}
      <div className="bg-paper/95 shadow-[0_2px_24px_rgba(22,34,44,0.06)] backdrop-blur-md">
        <div className="mx-auto flex h-[4.5rem] max-w-[1240px] items-center justify-between gap-6 px-5 lg:h-[5.5rem] lg:max-w-[1600px] lg:px-8 xl:px-16 2xl:px-24">
          <Link
            href="/"
            aria-label="André Araújo Advogados, ir para a página inicial"
            className="shrink-0"
          >
            <Image
              src="/logo-header.svg"
              alt="André Araújo Advogados"
              width={575}
              height={130}
              priority
              unoptimized
              className="h-10 w-auto lg:h-12"
            />
          </Link>

          <nav aria-label="Navegação principal" className="hidden xl:block">
            <ul className="flex items-center gap-2">
              {verticals.map((v) => {
                const active = v.key === activeWorld;
                return (
                  <li key={v.key} className="group relative">
                    <Link
                      href={v.home}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-1.5 whitespace-nowrap rounded-sm px-3 py-2 text-[0.9375rem] font-medium transition-colors hover:text-accent-deep ${
                        active ? "text-accent-deep" : "text-ink"
                      }`}
                    >
                      {v.label}
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-ink-soft transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
                      >
                        <path
                          d="M3 4.5L6 7.5L9 4.5"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>

                    {/* Submenu — subáreas da vertente; abre no hover ou foco */}
                    <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      <div className="rounded-md border border-line bg-paper p-2 shadow-[0_18px_50px_rgba(22,34,44,0.14)]">
                        <ul
                          className={`grid gap-0.5 ${
                            v.cols === 2
                              ? "w-[32rem] grid-cols-2"
                              : "w-[17rem] grid-cols-1"
                          }`}
                        >
                          {v.sections.map((s) => (
                            <li key={s.href}>
                              <Link
                                href={s.href}
                                aria-current={isActive(s.href) ? "page" : undefined}
                                className={`block rounded-sm px-3 py-2.5 text-[0.9375rem] transition-colors hover:bg-paper-light hover:text-accent-deep ${
                                  isActive(s.href)
                                    ? "font-medium text-accent-deep"
                                    : "text-ink"
                                }`}
                              >
                                {s.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={v.home}
                          className="mt-1 block border-t border-line px-3 pb-1 pt-3 text-[0.9375rem] font-medium text-accent-deep transition-colors hover:text-accent"
                        >
                          Ver a vertente completa
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })}

              <li>
                <Link
                  href="/blog"
                  aria-current={isActive("/blog") ? "page" : undefined}
                  className={`whitespace-nowrap rounded-sm px-3 py-2 text-[0.9375rem] font-medium transition-colors hover:text-accent-deep ${
                    isActive("/blog") ? "text-accent-deep" : "text-ink"
                  }`}
                >
                  Publicações
                </Link>
              </li>
            </ul>
          </nav>

          <div className="hidden items-center gap-5 xl:flex">
            <a
              href={site.phoneHref}
              className="hidden items-center gap-2 whitespace-nowrap text-[0.9375rem] font-medium text-ink transition-colors hover:text-accent-deep 2xl:flex"
            >
              {site.phone}
            </a>
            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-sm bg-accent-surface px-5 py-2.5 text-[0.9375rem] font-medium text-paper-light transition-all duration-300 hover:scale-[1.02] hover:bg-accent-surface-deep"
            >
              Falar no WhatsApp
            </a>
          </div>

          <button
            type="button"
            className="flex h-11 items-center gap-2 rounded-sm border border-ink/20 bg-paper-light px-4 text-[0.9375rem] font-medium text-ink transition-colors hover:border-accent xl:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              {open ? (
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 5.5h14M3 10h14M3 14.5h14"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              )}
            </svg>
            {open ? "Fechar" : "Menu"}
          </button>
        </div>
      </div>

      {/* Menu mobile — vertentes como acordeão + Publicações */}
      {open && (
        <nav
          id="menu-mobile"
          aria-label="Navegação principal (mobile)"
          className="border-t border-line bg-paper px-5 pb-8 pt-4 xl:hidden"
        >
          <ul className="flex flex-col">
            {verticals.map((v) => {
              const active = v.key === activeWorld;
              const expanded = openWorld === v.key;
              return (
                <li key={v.key} className="border-b border-line">
                  <div className="flex items-center">
                    <Link
                      href={v.home}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                      className={`flex-1 py-4 text-lg font-medium ${
                        active ? "text-accent-deep" : "text-ink"
                      }`}
                    >
                      {v.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenWorld((cur) => (cur === v.key ? null : v.key))
                      }
                      aria-expanded={expanded}
                      aria-label={`${expanded ? "Recolher" : "Expandir"} subáreas de ${v.label}`}
                      className="flex h-11 w-11 items-center justify-center text-ink-soft"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        aria-hidden="true"
                        className={`transition-transform duration-200 ${
                          expanded ? "rotate-180" : ""
                        }`}
                      >
                        <path
                          d="M4.5 6.75L9 11.25L13.5 6.75"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  {expanded && (
                    <ul className="mb-3 ml-1 flex flex-col gap-0.5 border-l border-line pl-4">
                      {v.sections.map((s) => (
                        <li key={s.href}>
                          <Link
                            href={s.href}
                            onClick={closeMenu}
                            className="block rounded-sm py-2.5 text-base text-ink-soft hover:text-accent-deep"
                          >
                            {s.label}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          href={v.home}
                          onClick={closeMenu}
                          className="block rounded-sm py-2.5 text-base font-medium text-accent-deep"
                        >
                          Ver a vertente completa
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              );
            })}
            <li className="border-b border-line">
              <Link
                href="/blog"
                onClick={closeMenu}
                aria-current={isActive("/blog") ? "page" : undefined}
                className={`block py-4 text-lg font-medium ${
                  isActive("/blog") ? "text-accent-deep" : "text-ink"
                }`}
              >
                Publicações
              </Link>
            </li>
          </ul>

          <div className="mt-6 flex flex-col gap-3">
            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-accent-surface px-6 py-3.5 font-medium text-paper-light"
            >
              Falar no WhatsApp
            </a>
            <a
              href={site.phoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-ink/25 px-6 py-3.5 font-medium text-ink"
            >
              {site.phone}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
