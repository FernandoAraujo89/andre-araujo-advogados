import type { Metadata } from "next";

/**
 * Área administrativa (/admin) — fora do índice dos buscadores e sem o
 * chrome do site público. Não há link para cá em nenhuma página; o acesso
 * é digitando o endereço e autenticando com a senha do escritório.
 */
export const metadata: Metadata = {
  title: "Painel",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-svh bg-paper">{children}</div>;
}
