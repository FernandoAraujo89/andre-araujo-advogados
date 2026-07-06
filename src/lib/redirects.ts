/**
 * Mapa de redirecionamentos 301 das URLs do site antigo (Wix) para o novo.
 *
 * As URLs de origem são mantidas EXATAMENTE como existem hoje, inclusive as
 * acentuadas e as com erro de digitação — é assim que estão indexadas.
 *
 * Este mapa é a fonte única: alimenta o next.config.ts (deploy com servidor,
 * ex.: Vercel) e os arquivos de exemplo em redirects/ para outros hosts.
 * Instruções de aplicação por plataforma no README, seção "Redirects 301".
 */

export const legacyRedirects: { source: string; destination: string }[] = [
  { source: "/direitocondominal", destination: "/areas-de-atuacao/direito-condominial" },
  { source: "/direitodoconsumidor", destination: "/areas-de-atuacao/direito-do-consumidor" },
  { source: "/direitoimobiliário", destination: "/areas-de-atuacao/direito-imobiliario" },
  { source: "/direitotributário", destination: "/areas-de-atuacao/direito-tributario" },
  { source: "/direitoempresarial", destination: "/areas-de-atuacao/direito-empresarial" },
  { source: "/recuperaçãodecrédito", destination: "/areas-de-atuacao/recuperacao-de-credito" },
  { source: "/institucional", destination: "/o-escritorio" },
  { source: "/escritorio", destination: "/o-escritorio" },
  { source: "/profissionais", destination: "/equipe" },
  { source: "/noticias", destination: "/blog" },
  { source: "/andrearaujo", destination: "/equipe/andre-augusto-de-araujo" },
  // Sávio deixou o escritório — a URL antiga cai na página geral da equipe
  { source: "/saviooliveira", destination: "/equipe" },
  { source: "/lp", destination: "/servidores-publicos/ferias-premio" },
  { source: "/copy-of-lp", destination: "/servidores-publicos/progressao-e-promocao" },
  { source: "/cópia-policial-penal-do-estado-de-mi", destination: "/servidores-publicos/adicional-noturno" },
];
