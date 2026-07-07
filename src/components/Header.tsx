"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { site, navMain, navSecondary } from "@/data/site";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const solid = scrolled || open;
  const closeMenu = () => setOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "bg-paper/90 shadow-[0_2px_24px_rgba(22,34,44,0.06)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1240px] items-center justify-between gap-8 px-5 lg:px-8">
        <Link
          href="/"
          aria-label="André Araújo Advogados — página inicial"
          className="shrink-0"
        >
          <Image
            src="/logo-header.svg"
            alt="André Araújo Advogados"
            width={575}
            height={130}
            preload
            unoptimized
            className="h-10 w-auto lg:h-11"
          />
        </Link>

        <nav aria-label="Navegação principal" className="hidden lg:block">
          <ul className="flex items-center gap-6 xl:gap-8">
            {navMain.map((item) => {
              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`whitespace-nowrap text-[0.9375rem] font-medium transition-colors hover:text-wine-deep ${
                      active ? "text-wine-deep" : "text-ink"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {"shortLabel" in item ? item.shortLabel : item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-5 xl:flex">
          <a
            href={site.phoneHref}
            className="hidden items-center gap-2 whitespace-nowrap text-[0.9375rem] font-medium text-ink transition-colors hover:text-wine-deep 2xl:flex"
          >
            {site.phone}
          </a>
          <a
            href={site.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-sm bg-wine px-5 py-2.5 text-[0.9375rem] font-medium text-paper-light transition-all duration-300 hover:scale-[1.02] hover:bg-wine-deep"
          >
            Falar no WhatsApp
          </a>
        </div>

        <button
          type="button"
          className="text-[0.9375rem] font-medium text-ink lg:hidden"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Fechar" : "Menu"}
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <nav
          aria-label="Navegação principal (mobile)"
          className="border-t border-line bg-paper px-5 pb-8 pt-4 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navMain.map((item) => (
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
          <div className="mt-3 border-t border-line pt-3">
            <ul className="flex flex-col gap-1">
              {navSecondary.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="block rounded-sm px-3 py-2.5 text-base text-ink-soft hover:bg-paper-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-wine px-6 py-3.5 font-medium text-paper-light"
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
