"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  site,
  worlds,
  navCivel,
  navServidor,
  type World,
} from "@/data/site";

const worldOrder: World[] = ["civel", "servidor"];

export default function Header({ world }: { world: World }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const nav = world === "servidor" ? navServidor : navCivel;
  const closeMenu = () => setOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Barra de vertente — escolha global; após clicar, o site muda de contexto */}
      <div className="border-b border-line bg-paper-light">
        <div className="mx-auto flex h-10 max-w-[1240px] items-center justify-center gap-3 px-5 sm:justify-end lg:px-8">
          <span className="hidden text-sm text-ink-soft sm:inline">
            Você está em:
          </span>
          <div
            role="group"
            aria-label="Escolha a área do escritório"
            className="flex items-center rounded-sm border border-line bg-paper p-0.5"
          >
            {worldOrder.map((key) => {
              const w = worlds[key];
              const active = key === world;
              return (
                <Link
                  key={key}
                  href={w.home}
                  aria-current={active ? "true" : undefined}
                  className={`rounded-[0.15rem] px-3 py-1 text-sm font-medium transition-colors ${
                    active
                      ? "bg-accent-surface text-paper-light"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  <span className="hidden sm:inline">{w.label}</span>
                  <span className="sm:hidden">{w.shortLabel}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Linha principal — sólida para funcionar sobre os heros coloridos */}
      <div className="bg-paper/95 shadow-[0_2px_24px_rgba(22,34,44,0.06)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-6 px-5 lg:h-20 lg:px-8">
          <Link
            href={world === "servidor" ? "/servidores-publicos" : "/"}
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
              className="h-12 w-auto lg:h-14"
            />
          </Link>

          <nav aria-label="Navegação principal" className="hidden lg:block">
            <ul className="flex items-center gap-6 xl:gap-8">
              {nav.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`whitespace-nowrap text-[0.9375rem] font-medium transition-colors hover:text-accent-deep ${
                        active ? "text-accent-deep" : "text-ink"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
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
            className="flex h-11 items-center gap-2 rounded-sm border border-ink/20 bg-paper-light px-4 text-[0.9375rem] font-medium text-ink transition-colors hover:border-accent lg:hidden"
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

      {/* Menu mobile */}
      {open && (
        <nav
          id="menu-mobile"
          aria-label="Navegação principal (mobile)"
          className="border-t border-line bg-paper px-5 pb-8 pt-4 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  className="block rounded-sm px-3 py-3 text-lg font-medium text-ink hover:bg-paper-light"
                >
                  {item.label}
                </Link>
              </li>
            ))}
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
