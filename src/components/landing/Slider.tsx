"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Carrossel simples de depoimentos: um por vez, com os pontos do layout para
 * navegar. Sem rotação automática (quem lê decide quando passar). Quando um
 * item é acrescentado no editor, mostra o novo.
 */
export default function Slider({
  slides,
  label,
  className = "",
  dotsClassName = "",
}: {
  slides: ReactNode[];
  label: string;
  className?: string;
  dotsClassName?: string;
}) {
  const n = slides.length;
  const [index, setIndex] = useState(0);
  const prevCount = useRef(n);

  useEffect(() => {
    if (n > prevCount.current) setIndex(n - 1);
    prevCount.current = n;
  }, [n]);

  const current = Math.max(0, Math.min(index, n - 1));
  if (n === 0) return null;

  return (
    <div className={className} role="region" aria-roledescription="carrossel" aria-label={label}>
      <div aria-live="polite">{slides[current]}</div>
      {n > 1 && (
        <div className={dotsClassName}>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Mostrar ${i + 1} de ${n}`}
              aria-current={i === current}
              className="grid size-6 place-items-center"
            >
              <span
                className={`block size-2.5 rounded-full transition-colors ${
                  i === current ? "bg-accent" : "bg-line hover:bg-ink-soft/40"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
