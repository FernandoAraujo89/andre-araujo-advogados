import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

/*
 * Par tipográfico inspirado em august-debouzy.com, que usa Akzidenz-Grotesk
 * (sans) + Ivyora Display itálico (serifa) — ambas comerciais. Os
 * equivalentes livres (OFL) mais próximos em proporção e desenho são a
 * família-irmã Instrument: Sans para texto e títulos, Serif só em itálico,
 * como acento. Ver os tokens em globals.css.
 */
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

// Só o itálico: a serifa nunca aparece em redondo, e assim evitamos
// pré-carregar um arquivo de fonte que ninguém usa.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "André Araújo Advogados | Advocacia em todo o Brasil",
    template: "%s | André Araújo Advogados",
  },
  description: site.description,
  openGraph: {
    siteName: site.name,
    locale: "pt_BR",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // data-scroll-behavior informa ao Next 16 que o smooth scroll do
    // globals.css é intencional (evita aviso nas transições de rota)
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${instrumentSans.variable} ${instrumentSerif.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
