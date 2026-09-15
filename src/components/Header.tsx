"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { site, navMain } from "@/data/site";
import { areasDeAtuacao } from "@/data/atuacao";

const AREAS_HREF = "/areas-de-atuacao";

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Navegação única, no padrão dos sites de escritórios de advocacia: "Áreas de
 * Atuação" abre um submenu com todas as áreas (dropdown no desktop, acordeão
 * no menu mobile) e os demais itens são links diretos. O menu completo aparece
 * a partir de xl (1280px); abaixo disso usa o hambúrguer.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  // "Áreas de Atuação" também fica ativo nas páginas de servidor público,
  // que são uma das áreas.
  const isNavActive = (href: string) =>
    href === AREAS_HREF
      ? isActive(AREAS_HREF) || isActive("/servidores-publicos")
      : isActive(href);

  const [areasOpen, setAreasOpen] = useState(isNavActive(AREAS_HREF));
  const closeMenu = () => setOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Linha principal — sólida para funcionar sobre o hero escuro */}
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
              {navMain.map((item) => {
                const active = isNavActive(item.href);
                const linkCls = `flex items-center gap-1.5 whitespace-nowrap rounded-sm px-3 py-2 text-[0.9375rem] font-medium transition-colors hover:text-accent-deep ${
                  active ? "text-accent-deep" : "text-ink"
                }`;

                if (item.href !== AREAS_HREF) {
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={linkCls}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={item.href} className="group relative">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={linkCls}
                    >
                      {item.label}
                      <Chevron className="mt-0.5 shrink-0 text-ink-soft transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
                    </Link>

                    {/* Submenu com todas as áreas; abre no hover ou foco */}
                    <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      <div className="rounded-md border border-line bg-paper p-2 shadow-[0_18px_50px_rgba(22,34,44,0.14)]">
                        <ul className="grid w-[34rem] grid-cols-2 gap-0.5">
                          {areasDeAtuacao.map((a) => (
                            <li key={a.href}>
                              <Link
                                href={a.href}
                                aria-current={isActive(a.href) ? "page" : undefined}
                                className={`block rounded-sm px-3 py-2.5 text-[0.9375rem] transition-colors hover:bg-paper-light hover:text-accent-deep ${
                                  isActive(a.href)
                                    ? "font-medium text-accent-deep"
                                    : "text-ink"
                                }`}
                              >
                                {a.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={AREAS_HREF}
                          className="mt-1 block border-t border-line px-3 pb-1 pt-3 text-[0.9375rem] font-medium text-accent-deep transition-colors hover:text-accent"
                        >
                          Ver todas as áreas
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })}
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

      {/* Menu mobile — áreas como acordeão + links diretos */}
      {open && (
        <nav
          id="menu-mobile"
          aria-label="Navegação principal (mobile)"
          className="border-t border-line bg-paper px-5 pb-8 pt-4 xl:hidden"
        >
          <ul className="flex flex-col">
            {navMain.map((item) => {
              const active = isNavActive(item.href);

              if (item.href !== AREAS_HREF) {
                return (
                  <li key={item.href} className="border-b border-line">
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                      className={`block py-4 text-lg font-medium ${
                        active ? "text-accent-deep" : "text-ink"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }

              return (
                <li key={item.href} className="border-b border-line">
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                      className={`flex-1 py-4 text-lg font-medium ${
                        active ? "text-accent-deep" : "text-ink"
                      }`}
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setAreasOpen((v) => !v)}
                      aria-expanded={areasOpen}
                      aria-label={`${areasOpen ? "Recolher" : "Expandir"} a lista de áreas`}
                      className="flex h-11 w-11 items-center justify-center text-ink-soft"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        aria-hidden="true"
                        className={`transition-transform duration-200 ${
                          areasOpen ? "rotate-180" : ""
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
                  {areasOpen && (
                    <ul className="mb-3 ml-1 flex flex-col gap-0.5 border-l border-line pl-4">
                      {areasDeAtuacao.map((a) => (
                        <li key={a.href}>
                          <Link
                            href={a.href}
                            onClick={closeMenu}
                            className="block rounded-sm py-2.5 text-base text-ink-soft hover:text-accent-deep"
                          >
                            {a.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
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
