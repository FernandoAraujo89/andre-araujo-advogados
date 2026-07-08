"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

type ParallaxBackdropProps = {
  src: string;
  /** Intensidade do deslocamento (% da altura). Padrão discreto. */
  amount?: number;
};

/**
 * Imagem de fundo em duotone escuro (grayscale + multiply sobre o ink),
 * com parallax sutil no scroll. Fica atrás do conteúdo, sem capturar
 * cliques. O multiply só escurece — o contraste do texto claro por cima
 * é preservado. Respeita prefers-reduced-motion (sem deslocamento).
 */
export default function ParallaxBackdrop({
  src,
  amount = 12,
}: ParallaxBackdropProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${amount}%`, `${amount}%`],
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        style={reduce ? undefined : { y }}
        className="absolute inset-x-0 top-[-20%] h-[140%]"
      >
        <Image
          src={src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-90 grayscale brightness-[1.45] contrast-[1.05] mix-blend-multiply"
        />
      </motion.div>

      {/* Véu para dar profundidade e reforçar o contraste do texto à esquerda */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-ink/55" />
    </div>
  );
}
