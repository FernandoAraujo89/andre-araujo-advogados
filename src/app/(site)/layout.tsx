import SiteChrome from "@/components/SiteChrome";

/** Todas as páginas públicas compartilham o mesmo chrome (header, rodapé, WhatsApp). */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SiteChrome>{children}</SiteChrome>;
}
