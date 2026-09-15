"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useInView, useReducedMotion } from "framer-motion";

type StatCounterProps = {
  /** Valor numérico a animar; null para itens textuais (ex.: "Brasil") */
  value: number | null;
  /** Texto exibido quando value é null */
  display?: string;
  suffix?: string;
  label: string;
  /** Link opcional abaixo do rótulo (ex.: "Conheça a equipe") */
  href?: string;
  linkLabel?: string;
  /** Cores claras para uso sobre fundo escuro (ex.: hero) */
  dark?: boolean;
};

function formatNumber(n: number): string {
  return n.toLocaleString("pt-BR");
}

/**
 * Número da barra de credibilidade com contagem animada ao entrar na viewport.
 * Com prefers-reduced-motion, mostra o valor final direto.
 */
export default function StatCounter({
  value,
  display,
  suffix = "",
  label,
  href,
  linkLabel,
  dark = false,
}: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (value === null || !inView || reduceMotion) return;
    const duration = 1400;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCurrent(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduceMotion]);

  // Com prefers-reduced-motion, exibe o valor final sem animar.
  const shown = reduceMotion && value !== null ? value : current;

  return (
    <div ref={ref}>
      <p
        className={`text-[clamp(2.75rem,-0.25rem+4.5vw,3.75rem)] leading-none tracking-[-0.04em] ${
          dark ? "text-paper-light" : "text-ink"
        }`}
      >
        {value === null ? display : formatNumber(shown)}
        {suffix && (
          <span className={dark ? "text-gold" : "text-accent"}>{suffix}</span>
        )}
      </p>
      <p
        className={`mt-3 text-[0.9375rem] ${dark ? "text-paper/70" : "text-ink-soft"}`}
      >
        {label}
      </p>
      {href && linkLabel && (
        <Link
          href={href}
          className={`mt-2 inline-block text-[0.9375rem] font-medium underline decoration-current/40 underline-offset-4 transition-colors ${
            dark
              ? "text-gold hover:text-paper-light"
              : "text-accent-deep hover:text-accent"
          }`}
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
