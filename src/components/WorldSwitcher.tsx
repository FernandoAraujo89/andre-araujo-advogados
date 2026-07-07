import Link from "next/link";
import { worlds, type World } from "@/data/site";

/**
 * Seletor das duas vertentes ("dois sites") — fixo no canto da tela.
 * A vertente atual fica em destaque; a outra é um link que leva à sua home
 * e re-tematiza o site inteiro (ver data-world). Único elemento que "muda o
 * site completamente" com um clique.
 */
export default function WorldSwitcher({ current }: { current: World }) {
  const order: World[] = ["civel", "servidor"];
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div
        role="group"
        aria-label="Alternar entre as áreas do escritório"
        className="flex items-center rounded-sm border border-line bg-paper-light/95 p-1 shadow-[0_10px_30px_rgba(22,34,44,0.14)] backdrop-blur"
      >
        {order.map((key) => {
          const w = worlds[key];
          const active = key === current;
          return (
            <Link
              key={key}
              href={w.home}
              aria-current={active ? "true" : undefined}
              className={`rounded-[0.2rem] px-3 py-2 text-sm font-medium transition-colors ${
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
  );
}
