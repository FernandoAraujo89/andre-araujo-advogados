import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "light" | "ghost-light" | "whatsapp";
  size?: "md" | "lg";
  external?: boolean;
  className?: string;
  ariaLabel?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]";

const variants = {
  primary: "bg-accent-surface text-paper-light hover:bg-accent-surface-deep",
  secondary:
    "border border-ink/25 text-ink hover:border-accent hover:text-accent-deep",
  light: "bg-paper text-ink hover:bg-paper-light",
  // Contorno claro para uso sobre fundos escuros (heros coloridos).
  "ghost-light":
    "border border-paper/40 text-paper-light hover:border-paper-light hover:bg-paper/10",
  whatsapp: "bg-accent-surface text-paper-light hover:bg-accent-surface-deep",
};

const sizes = {
  md: "px-6 py-3 text-[0.9375rem]",
  lg: "px-8 py-4 text-base",
};

export default function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  external,
  className = "",
  ariaLabel,
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
