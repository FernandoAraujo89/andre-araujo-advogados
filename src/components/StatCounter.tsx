"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type StatCounterProps = {
  /** Valor numérico a animar; null para itens textuais (ex.: "Formiga") */
  value: number | null;
  /** Texto exibido quando value é null */
  display?: string;
  suffix?: string;
  label: string;
};

function formatNumber(n: number): string {
  return n.toLocaleString("pt-BR");
}

/**
 * Número da barra de credibilidade com contagem animada ao entrar na viewport.
 * Com prefers-reduced-motion, mostra o valor final direto.
 */
export default function StatCounter({ value, display, suffix = "", label }: StatCounterProps) {
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
      <p className="font-serif text-[clamp(2.5rem,4.5vw,3.75rem)] font-medium leading-none text-ink">
        {value === null ? display : formatNumber(shown)}
        {suffix && <span className="text-brass">{suffix}</span>}
      </p>
      <p className="mt-3 text-[0.9375rem] text-ink-soft">{label}</p>
    </div>
  );
}
