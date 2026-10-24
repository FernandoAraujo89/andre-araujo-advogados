"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Trilho horizontal de cards (seção "Cards com foto"): rola com o dedo ou o
 * trackpad, encaixa card a card e tem as setas redondas do layout no canto
 * inferior direito. As setas somem quando todos os cards cabem na tela.
 */
export default function CardRail({
  children,
  className = "",
  controlsClassName = "",
  label,
}: {
  children: ReactNode;
  className?: string;
  controlsClassName?: string;
  label: string;
}) {
  const rail = useRef<HTMLUListElement>(null);
  const [state, setState] = useState({ prev: false, next: false });

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const update = () =>
      setState({
        prev: el.scrollLeft > 4,
        next: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
      });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    for (const child of Array.from(el.children)) ro.observe(child);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [children]);

  function go(dir: 1 | -1) {
    const el = rail.current;
    if (!el) return;
    const items = Array.from(el.children) as HTMLElement[];
    const step =
      items.length > 1
        ? items[1].offsetLeft - items[0].offsetLeft
        : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  const arrow =
    "grid size-[2.625rem] place-items-center rounded-full border border-accent bg-paper-light text-ink transition-colors hover:bg-accent hover:text-paper-light disabled:pointer-events-none disabled:opacity-35";

  return (
    <>
      <ul ref={rail} aria-label={label} className={className}>
        {children}
      </ul>
      {(state.prev || state.next) && (
        <div className={controlsClassName}>
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={!state.prev}
            aria-label="Cards anteriores"
            className={arrow}
          >
            <ChevronLeft aria-hidden className="size-5" strokeWidth={2.25} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={!state.next}
            aria-label="Próximos cards"
            className={arrow}
          >
            <ChevronRight aria-hidden className="size-5" strokeWidth={2.25} />
          </button>
        </div>
      )}
    </>
  );
}
