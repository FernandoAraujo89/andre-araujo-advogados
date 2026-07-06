import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "light" | "whatsapp";
  size?: "md" | "lg";
  external?: boolean;
  className?: string;
  ariaLabel?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]";

const variants = {
  primary: "bg-wine text-paper-light hover:bg-wine-deep",
  secondary:
    "border border-ink/25 text-ink hover:border-wine hover:text-wine-deep",
  light: "bg-paper text-ink hover:bg-paper-light",
  whatsapp: "bg-wine text-paper-light hover:bg-wine-deep",
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
