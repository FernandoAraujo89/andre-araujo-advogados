import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "André Araújo Advogados | Advocacia em Formiga, MG",
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
      className={`${fraunces.variable} ${inter.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
